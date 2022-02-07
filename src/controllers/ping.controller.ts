import {inject} from '@loopback/core';
import {
  get, post, Request, requestBody, RequestContext, response,
  ResponseObject, RestBindings
} from '@loopback/rest';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
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

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.CONTEXT) private requestCtx: RequestContext) { }

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }





  @post('/test')
  async test(@requestBody({content: {'text/plain': {}}}) texto: string

  ): Promise<any> {

    if (texto.length < 1) return 0;

    return await this.runScript(texto)


  }


  async runScript(script: string): Promise<number> {
    try {
      return await new Promise(resolve => eval("(function(returnCallback){" + script + "})")((data: any) => {
        console.log('Testeando script ----');
        resolve(data);

      }))

    } catch (error) {
      console.log('Test: error en script ----');
      return 0;

    }
    return 0;


  };



}













