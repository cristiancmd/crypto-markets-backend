import {inject} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
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

    @inject(LoggingBindings.WINSTON_LOGGER)
    private logger: WinstonLogger
    constructor(@repository(CoinRepository) public coinRepository: CoinRepository,
        @repository(PrecioRepository) public precioRepository: PrecioRepository,
        @repository(UserCoinRepository) public usercoinRepo: UserCoinRepository,
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(ExchangeRepository) public exchangeRepository: ExchangeRepository,

    ) {


        super({

            name: 'job-C',
            onTick: async () => {
                const coins: Coin[] = await coinRepository.find();

                const exchanges: Exchange[] = await exchangeRepository.find({
                    fields: {script: false}
                });
                const average = (arr: any[]) => arr.reduce((p, c) => p + c, 0) / arr.length;

                this.logger.log('info', `Ejecutando price updater`);
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
            await this.coinRepository.updateById(coin.id, newCoin).catch(e => {
                this.logger.log('error', e);
            })
            this.logger.log('info', `avgPrice: ${val} | ${coin.name}`);


        } catch (error) {

            this.logger.log('error', error);
        }
    }









}
