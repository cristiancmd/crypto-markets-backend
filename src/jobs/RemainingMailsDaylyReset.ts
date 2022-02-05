import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {User} from '../models';
import {UserRepository} from '../repositories';


@cronJob()
export class MailReseter extends CronJob {


  constructor(@repository(UserRepository) public userRepo: UserRepository

  ) {

    super({
      name: 'job-E',
      onTick: async () => {
        console.log(new Date(), '-------------Reseteando mails restantes en usuarios ------------');

        const users: User[] = await userRepo.find({fields: {id: true, email: true, remainingmails: true, premium: true}});

        let puserIds = users.filter(u => u.premium == true).map(u => u.id)

        let suserIds = users.filter(u => !u.premium).map(u => u.id)

        console.log('Premium users:', puserIds);
        console.log('Standard users', suserIds);




        const standardUser = new User;
        standardUser.remainingmails = 1;
        const premiumUser = new User;
        premiumUser.remainingmails = 99;



        this.userRepo.updateAll(standardUser, {id: {inq: suserIds}}).catch(e => {
          console.log(e);
        })

        this.userRepo.updateAll(premiumUser, {id: {inq: puserIds}}).catch(e => {
          console.log(e);
        })




      },

      runOnInit: true,
      cronTime: '0 0 * * *',
      // todos los dias a las 00 hs supuestamente
      start: true,
    });
  }








}





