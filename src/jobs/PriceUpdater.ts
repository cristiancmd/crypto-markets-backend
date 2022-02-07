import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {Coin} from '../models';
import {UserRepository} from '../repositories';
import {Exchange} from './../models/exchange.model';
import {CoinRepository} from './../repositories/coin.repository';
import {ExchangeRepository} from './../repositories/exchange.repository';
import {PrecioRepository} from './../repositories/precio.repository';
import {UserCoinRepository} from './../repositories/user-coin.repository';


@cronJob()
export class PriceUpdater extends CronJob {


    constructor(@repository(CoinRepository) public coinRepository: CoinRepository,
        @repository(PrecioRepository) public precioRepository: PrecioRepository,
        @repository(UserCoinRepository) public usercoinRepo: UserCoinRepository,
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(ExchangeRepository) public exchangeRepository: ExchangeRepository

    ) {

        super({
            name: 'job-C',
            onTick: async () => {
                console.log(new Date(), 'Ejecutando price updater');
                const coins: Coin[] = await coinRepository.find();

                const exchanges: Exchange[] = await exchangeRepository.find({
                    fields: {script: false}
                });
                const average = (arr: any[]) => arr.reduce((p, c) => p + c, 0) / arr.length;

                coins.forEach(coin => {
                    const arrEx = exchanges.filter(ex => ex.coinId == coin.id);
                    const result = average(arrEx.map(arr => arr.lastPrice));
                    const val = Number(Math.floor((result) * 100) / 100)
                    this.updateData(coin, val);

                })



            },

            runOnInit: true,
            cronTime: '*/1 * * * *',
            start: true,
        });
    }

    async updateData(coin: Coin, val: number) {
        try {
            const newCoin = new Coin
            newCoin.avgPrice = Number(val);
            await this.coinRepository.updateById(coin.id, newCoin)
            console.log(new Date(), 'Actualizada: ', coin.name, ': ', val);


        } catch (error) {
            console.log(error);
        }
    }









}
