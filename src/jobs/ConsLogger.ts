import {inject} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {repository} from '@loopback/repository';
import {Exchange, Precio} from '../models';
import {PrecioRepository} from '../repositories';
import {ExchangeRepository} from './../repositories/exchange.repository';


@cronJob()
export class MyCronJob extends CronJob {


    constructor(@repository(ExchangeRepository) public exchangeRepository: ExchangeRepository,
        @repository(PrecioRepository) public precioRepository: PrecioRepository,
        @inject(LoggingBindings.WINSTON_LOGGER)
        private logger: WinstonLogger
    ) {

        super({
            name: 'job-B',
            onTick: async () => {
                const exchanges: Exchange[] = await exchangeRepository.find();

                this.logger.log('info', `Ejecutando scripts en exchanges`);

                exchanges.forEach(exchange => {
                    this.runScript(<string>exchange.script, exchange).catch(e => {
                        this.logger.log('error', `${exchange.name} : ${e} `);
                    }
                    )
                })
            },

            runOnInit: true,
            cronTime: '*/2 * * * *',

            start: true,
        });
    }






    async runScript(script: string, e: Exchange) {

        eval("(function(returnCallback){" + script + "})")((data: number) => {

            const newPrecio = new Precio()
            newPrecio.date = new Date()
            newPrecio.coinId = <string>e.coinId
            newPrecio.exchangeId = <string>e.id
            newPrecio.value = Number(data)

            this.logger.log('info', `Exchange:  ${e.name} CoinId: ${e.coinId}  nuevo valor: ${Number(data)} `);


            this.precioRepository.create(newPrecio).
                catch(err => {
                    this.logger.log('error', err);

                    return;
                })

            let ex = new Exchange;
            ex.lastPrice = newPrecio.value;

            this.exchangeRepository.updateById(newPrecio.exchangeId, ex).catch(e => this.logger.log('error', e)
            )

        }
        )

    }


}





