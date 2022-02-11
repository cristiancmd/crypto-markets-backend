import {inject} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {repository} from '@loopback/repository';
import {ChartConfiguration} from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-moment';
import {ChartCallback, ChartJSNodeCanvas} from 'chartjs-node-canvas';
import {Coin} from '../models';
import {PrecioRepository} from '../repositories';
import {CoinRepository} from './../repositories/coin.repository';

@cronJob()
export class MiniChartGenerator extends CronJob {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger
  arrPrices: any[] = [];


  constructor(@repository(CoinRepository) public coinRepo: CoinRepository,
    @repository(PrecioRepository) public precioRepo: PrecioRepository,

  ) {

    super({
      name: 'job-Chart',
      onTick: async () => {

        let date = new Date(Date.now() - (150 * 3600000)); // rango de precios
        let cada = new Date(Date.now() - (12 * 3600000)); // cada 12 horas


        let coins = await coinRepo.find({
          where: {
            avgPrice: {gt: 0},
            lastChart: {lt: cada}
          },
          fields: {miniChart: false}
        })



        coins.forEach(async coin => {
          if (coin.avgPrice != null) {
            let prices = await this.getPrices(date, coin.id);

            const m = prices.map(e => ({value: e.value, date: e.date.toString()}));


            const image = await this.generateChart(m);

            let newcoin = new Coin;
            newcoin.miniChart = image;
            newcoin.lastChart = new Date();

            await this.coinRepo.updateById(coin.id, newcoin)
              .catch(e => this.logger.log('error', ` updateById : ${e}`))

            this.logger.log('info', `MiniChart generado para: ${coin.id} `)
          }

        }
        )


      },

      runOnInit: true,
      cronTime: '*/15 * * * *',
      //
      start: true,
    });

  }


  async getPrices(date: Date, coinId: any): Promise<any[]> {
    let priceModel = await this.precioRepo.findOne({
      where: {
        coinId: coinId,
        date: {gt: date}
      },
    });


    let prices = await this.precioRepo.find(
      {
        where: {
          coinId: priceModel?.coinId,
          exchangeId: priceModel?.exchangeId,
          date: {gt: date}
        },
        fields: {date: true, value: true}
      })


    return prices;

  }



  async generateChart(data: any[]): Promise<any> {

    const configuration: ChartConfiguration = {
      type: 'line',
      data: {

        datasets: [{
          data: data,
          borderColor: 'rgb(255, 250, 253)'
        }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 2
          },
          point: {
            borderWidth: 0,
            hitRadius: 0,
            radius: 0,

          }
        },
        parsing: {
          xAxisKey: 'date',
          yAxisKey: 'value',

        },
        scales: {
          x: {

            display: false,
            offset: true,
            time: {
            }
          },
          y: {
            display: false,

          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }

    };


    const chartCallback: ChartCallback = (ChartJS) => {
      ChartJS.defaults.responsive = false;
      ChartJS.defaults.maintainAspectRatio = false;
    };
    let chartJSNodeCanvas = new ChartJSNodeCanvas({width: 130, height: 50, chartCallback});

    const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration)
    // const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    // await fs.writeFile(`./image${new Date().getTime()}.png`, buffer, 'base64');


    return dataUrl;


  }








}
