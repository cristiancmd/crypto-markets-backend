import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {Coin, Precio, UserCoin} from '../models';
import {UserRepository} from '../repositories';
import {User} from './../models/user.model';
import {CoinRepository} from './../repositories/coin.repository';
import {PrecioRepository} from './../repositories/precio.repository';
import {UserCoinRepository} from './../repositories/user-coin.repository';


@cronJob()
export class PriceUpdater extends CronJob {


    constructor(@repository(CoinRepository) public coinRepository: CoinRepository,
        @repository(PrecioRepository) public precioRepository: PrecioRepository,
        @repository(UserCoinRepository) public usercoinRepo: UserCoinRepository,
        @repository(UserRepository) public userRepository: UserRepository,


    ) {

        super({
            name: 'job-C',
            onTick: async () => {
                const coins: Coin[] = await coinRepository.find();
                const precios: Precio[] = await precioRepository.find(
                    {where: {date: {gt: new Date(Date.now() - 60000)}}});


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
                            // this.notifyUsers(users, usercoins, coin, val).catch(e => console.error(e));
                        }

                    })
                }

            },

            // runOnInit: true,
            cronTime: '*/1 * * * *',
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

    // async notifyUsers(users: User[], actcoin: Coin, val: number) {

    //     users = users.filter(u => u.usercoins !== undefined);
    //     // console.log(users);


    //     const usrs = users.filter(u => u.usercoins.some(c => c.id === actcoin.id))

    //     console.log('unoty : ', usrs);
    //     console.log('moneda:', actcoin.name);
    // }

    async notifyUsers(users: User[], usercoins: UserCoin[], actcoin: Coin, val: number) {

        // users = users.filter(u => u.usercoins !== undefined);
        // // console.log(users);


        // const usercoinsofusers = usercoins.filter(uc=> uc.id == actcoin.id && (uc.max && uc.max>val || (uc.min & uc.min<val )) )
        // // const usrs = users.filter(u => u.usercoins.some(c => c.id === actcoin.id))


        // console.log('unoty : ', usrs);
        // console.log('moneda:', actcoin.name);
    }





}
