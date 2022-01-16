import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {Coin, Precio} from '../models';
import {CoinRepository} from './../repositories/coin.repository';
import {PrecioRepository} from './../repositories/precio.repository';


@cronJob()
export class PriceUpdater extends CronJob {


    constructor(@repository(CoinRepository) public coinRepository: CoinRepository,
        @repository(PrecioRepository) public precioRepository: PrecioRepository

    ) {

        super({
            name: 'job-C',
            onTick: async () => {
                const coins: Coin[] = await coinRepository.find();
                const precios: Precio[] = await precioRepository.find(
                    {where: {date: {gt: new Date(Date.now() - 300000)}}});

                console.log(new Date(), 'Ejecutando price updater');
                // console.log(coins)
                // console.log(precios)
                if (precios.length > 0) {
                    coins.forEach(coin => {
                        let cant = 0; let sum = 0;
                        precios.forEach(precio => {
                            // eslint-disable-next-line eqeqeq
                            if (precio.coinId == coin.id && precio.value > 0) {
                                sum += precio.value
                                cant++;
                            }

                        })

                        if (cant > 0) {
                            const val = Number(Math.floor((sum / cant) * 100) / 100)
                            this.updateData(coin, val).catch(e => console.log(e))
                            console.log(val, ' ACTUALIZADO', coin.name)
                        }

                    })
                }

            },


            cronTime: '*/300 * * * * *',
            start: true,
        });
    }

    async updateData(coin: Coin, val: number) {
        try {
            const newCoin = new Coin
            newCoin.avgPrice = Number(val);
            await this.coinRepository.updateById(coin.id, newCoin)

        } catch (error) {
            console.log(error);
        }


    }






}
