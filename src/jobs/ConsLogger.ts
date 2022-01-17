import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {Exchange, Precio} from '../models';
import {PrecioRepository} from '../repositories';
import {ExchangeRepository} from './../repositories/exchange.repository';


@cronJob()
export class MyCronJob extends CronJob {


    constructor(@repository(ExchangeRepository) public exchangeRepository: ExchangeRepository,
        @repository(PrecioRepository) public precioRepository: PrecioRepository
    ) {

        super({
            name: 'job-B',
            onTick: async () => {
                const exchanges: Exchange[] = await exchangeRepository.find();

                console.log(new Date(), 'Ejecutando scripts en exchanges');

                exchanges.forEach(exchange => {
                    this.runScript(<string>exchange.script, exchange).catch((e) =>
                        console.error(exchange.name, ' : ', console.log(e)));
                });
            },

            runOnInit: true,
            cronTime: '*/60 * * * * *',
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

            console.log(new Date(), Number(data), e.name, e.coinId);

            this.precioRepository.create(newPrecio).
                catch(err => {
                    console.error('error al crear Precio :  ', err)
                    return;
                })


        }
        )

    }


}





