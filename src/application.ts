import {
  AuthenticationComponent, registerAuthenticationStrategy
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass, extensionFor} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {
  LoggingBindings, LoggingComponent, WinstonTransports, WINSTON_TRANSPORT
} from '@loopback/logging';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {format} from 'winston';
import {JWTAuthenticationStrategy, KEY} from './authentication-strategies';
import {JWTServiceProvider} from './authentication-strategies/jwt-service';
import {MyCronJob} from './jobs/ExchangeFetcher';
import {MailNotifier} from './jobs/MailNotifierCheck';
import {PriceUpdater} from './jobs/PriceUpdater';
import {MailReseter} from './jobs/RemainingMailsDailyReset';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class CryptomarketsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Bind authentication component related elements
    this.component(AuthenticationComponent);

    this.service(JWTServiceProvider);

    // Register the Auth0 JWT authentication strategy
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    this.configure(KEY).to({
      jwksUri: 'https://dev-nq15j8cp.us.auth0.com/.well-known/jwks.json',
      audience: 'test-api-iaw',
      issuer: 'https://dev-nq15j8cp.us.auth0.com/',
      algorithms: ['RS256'],
    });


    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false, // default to true
      enableHttpAccessLog: true, // default to true
    });

    // Logger
    this.component(LoggingComponent);

    // const myFormat: WinstonFormat = format((info, opts) => {
    //   console.log(info);
    //   return false;
    // })();
    const {combine, timestamp, label, printf} = format;

    const myFormat = printf(({level, message, timestamp}) => {
      return `${timestamp} ${level}: ${message}`;
    });

    // this
    //   .bind('logging.winston.formats.myFormat')
    //   .to(myFormat)
    //   .apply(extensionFor(WINSTON_FORMAT));

    // this
    //   .bind('logging.winston.formats.colorize')
    //   .to(format.colorize())
    //   .apply(extensionFor(WINSTON_FORMAT));

    const consoleTransport = new WinstonTransports.Console({
      level: 'info',
      format: format.combine(format.timestamp(), format.colorize(), format.simple(), format.prettyPrint(), myFormat),
    });

    // const fileTransport = new WinstonTransports.File({
    //   level: 'info',
    //   format: format.combine(format.timestamp(), format.colorize(), format.simple()),
    //   filename: 'combined.log',
    // });

    const fileTransport = new WinstonTransports.File({
      level: 'info',
      format: format.combine(format.timestamp(), format.prettyPrint(), myFormat),
      filename: 'LogCombined.log',
    });




    this
      .bind('logging.winston.transports.console')
      .to(consoleTransport)
      .apply(extensionFor(WINSTON_TRANSPORT));

    this
      .bind('logging.winston.transports.file')
      .to(fileTransport)
      .apply(extensionFor(WINSTON_TRANSPORT));






    this.component(RestExplorerComponent);

    //Jobs
    this.component(CronComponent);
    this.add(createBindingFromClass(MyCronJob));

    this.add(createBindingFromClass(PriceUpdater));

    this.add(createBindingFromClass(MailNotifier));

    this.add(createBindingFromClass(MailReseter));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };




  }
}
