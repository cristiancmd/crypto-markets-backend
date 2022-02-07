import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {Coin, User, UserCoin} from '../models';
import {CoinRepository, UserCoinRepository, UserRepository} from '../repositories';


@cronJob()
export class MailNotifier extends CronJob {


  constructor(@repository(UserCoinRepository) public usercoinRepo: UserCoinRepository,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(CoinRepository) public coinRepository: CoinRepository
  ) {

    super({
      name: 'job-D',
      onTick: async () => {

        const users: User[] = await userRepository.find(
          {
            fields: {id: true, email: true, remainingmails: true, premium: true},
            where: {remainingmails: {gt: 0}},
          }
        );
        const coins: Coin[] = await coinRepository.find();
        const arrusers = users.map(u => u.id);
        // console.log(arrusers);
        const usercoins: UserCoin[] = await usercoinRepo.find({where: {userId: {inq: arrusers}, notified: false}});
        // console.log(usercoins);

        const updateusersArr: UserCoin[] = []

        coins.forEach(coin => {
          usercoins.forEach(uc => {

            // eslint-disable-next-line eqeqeq
            if (coin.id == uc.coinId && (uc.max && coin.avgPrice && coin.avgPrice > uc.max) || (coin.id == uc.coinId && uc.min && coin.avgPrice && uc.min > coin.avgPrice)) {
              console.log("enviando mail..", coin.avgPrice, coin.name, coin.id, uc.email);
              this.sendMailtoUser(uc, coin);
              //sendmail
              updateusersArr.push(uc);
              //actualizar user
              //actualizar usercoin
            }

          })
        })
        this.updateUsers(updateusersArr);



      },

      runOnInit: true,
      cronTime: '*/1 * * * *',

      start: true,
    });
  }

  async sendMailtoUser(ucoin: UserCoin, coin: Coin) {
    const nodemailer = require("nodemailer");

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true, // true for 465, false for other ports 587
      auth: {
        user: process.env.MAILER_USER, // generated ethereal user
        pass: process.env.MAILER_PASS, // generated ethereal password
      },
    });
    const date = new Date();

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Crypto Markets IAW" <cristian.iaw@yahoo.com>', // sender address
      to: ucoin.email, // list of receivers
      subject: `Alerta para su moneda: ${coin.name} `, // Subject line
      text: `Moneda: ${coin.name} ; Valor:${coin.avgPrice} `, // plain text body
      html: `<b>Moneda: ${coin.name} ha alcanzado el valor: $${coin.avgPrice} en ${date.toLocaleDateString("es-AR")} </b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("enviado a: ", ucoin.email);


  }

  async updateUsers(ucoin: UserCoin[]) {
    ucoin.forEach(uc => {

      this.userRepository.findById(uc.userId).then(
        u => {
          let newuser = new User; newuser.remainingmails = u.remainingmails - 1;
          this.userRepository.updateById(u.id, newuser).catch(e => console.log(e))
        }).catch(e => console.log(e))

    })

    let ucoins = ucoin.map(uc => uc.id);
    let newucoin = new UserCoin;
    newucoin.notified = true;
    this.usercoinRepo.updateAll(newucoin, {id: {inq: ucoins}}).catch(e => console.log(e))


  }




}





