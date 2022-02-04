import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, RequestContext, response, ResponseObject, RestBindings} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from './../repositories/user.repository';

const mercadopago = require("mercadopago");

const MP_URL_RESPONSE: ResponseObject = {
  description: 'Payment url',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'MercadopagoPaymentUrl',
        properties: {
          date: {type: 'string'},
          url: {type: 'object'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};


export class MercadopagoController {
  constructor(@inject(RestBindings.Http.CONTEXT) private requestCtx: RequestContext,
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }



  @get('/payment')
  @response(200, MP_URL_RESPONSE)
  @authenticate({strategy: 'auth0-jwt'})
  async payment(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<object> {

    const user: Partial<UserProfile> = {...currentUserProfile};
    const userid = user.sub.split("|")[1] || user.sub.split("|")[0]

    console.log(userid);


    return {
      date: new Date(),
      url: await this.paymentLink(userid),

    };
  }

  // const {request, response} = this.requestCtx;
  // this.requestCtx.response.status(200).send({
  //   date: new Date(),
  //   res: q,
  // });

  @get('/mpfeedback')
  async feedback(

  ) {

    const aquery = this.requestCtx.request.query;
    if (aquery.status && aquery.status == 'approved' && aquery.external_reference) {
      let user = new User;
      user.premium = true;
      user.remainingmails = 99;
      let id = aquery.external_reference.toString();
      await this.userRepository.updateById(id, user);
      console.log(id, "-------- usuario premium activado --------");
    }
    return this.requestCtx.response.redirect(`${process.env.API_FRONT_URL}/profile`);
  }





  async paymentLink(user: string): Promise<object> {
    let res: object = {}
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN,
    });

    const preference = {
      back_urls: {
        success: `${process.env.API_URL}/mpfeedback`,
        failure: `${process.env.API_URL}/mpfeedback`,
        pending: `${process.env.API_URL}/mpfeedback`,
      },
      auto_return: "approved",
      external_reference: user,
      // notification_url: "",
      items: [
        {
          title: "CryptoMarkets Premium account",
          unit_price: 120,
          quantity: 1,
        },
      ],
    };

    await mercadopago.preferences
      .create(preference)
      .then(function (response: any) {
        console.log(response.body.external_reference);
        console.log(response.body.init_point);
        res = {
          init_point: response.body.init_point,
          external_reference: response.body.external_reference
        }
        return res;
      })
      .catch(function (error: any) {
        console.log(error);
      });

    return res;

  }



}
