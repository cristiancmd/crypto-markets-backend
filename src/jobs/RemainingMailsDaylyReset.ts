import {inject} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {repository} from '@loopback/repository';
import {User} from '../models';
import {UserRepository} from '../repositories';


@cronJob()
export class MailReseter extends CronJob {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger

  constructor(@repository(UserRepository) public userRepo: UserRepository,


  ) {

    super({
      name: 'job-E',
      onTick: async () => {

        const users: User[] = await userRepo.find({fields: {id: true, email: true, remainingmails: true, premium: true}});

        let puserIds = users.filter(u => u.premium == true).map(u => u.id)

        let suserIds = users.filter(u => !u.premium).map(u => u.id)

        this.logger.log('info', `-------------Reseteando mails restantes en usuarios ------------ `)
        this.logger.log('info', `Premium users: ${puserIds}  `)
        this.logger.log('info', `Standard users: ${suserIds}  `)



        const standardUser = new User;
        standardUser.remainingmails = 1;
        const premiumUser = new User;
        premiumUser.remainingmails = 99;



        this.userRepo.updateAll(standardUser, {id: {inq: suserIds}}).catch(e => {
          this.logger.log('error', e)
        })

        this.userRepo.updateAll(premiumUser, {id: {inq: puserIds}}).catch(e => {
          this.logger.log('error', e)

        })




      },

      runOnInit: true,
      cronTime: '0 0 * * *',
      // todos los dias a las 00 hs supuestamente
      start: true,
    });
  }








}





