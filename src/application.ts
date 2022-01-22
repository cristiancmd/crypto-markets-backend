import {
  AuthenticationComponent, registerAuthenticationStrategy
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationStrategy, KEY} from './authentication-strategies';
import {JWTServiceProvider} from './authentication-strategies/jwt-service';
import {MyCronJob} from './jobs/ConsLogger';
import {PriceUpdater} from './jobs/PriceUpdater';
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
    this.component(RestExplorerComponent);

    this.component(CronComponent);
    this.add(createBindingFromClass(MyCronJob));

    this.add(createBindingFromClass(PriceUpdater))

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
