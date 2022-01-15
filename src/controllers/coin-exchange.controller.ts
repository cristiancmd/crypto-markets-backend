import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Coin,
  Exchange,
} from '../models';
import {CoinRepository} from '../repositories';

export class CoinExchangeController {
  constructor(
    @repository(CoinRepository) protected coinRepository: CoinRepository,
  ) { }

  @get('/coins/{id}/exchanges', {
    responses: {
      '200': {
        description: 'Array of Coin has many Exchange',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Exchange)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Exchange>,
  ): Promise<Exchange[]> {
    return this.coinRepository.exchanges(id).find(filter);
  }

  @post('/coins/{id}/exchanges', {
    responses: {
      '200': {
        description: 'Coin model instance',
        content: {'application/json': {schema: getModelSchemaRef(Exchange)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Coin.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exchange, {
            title: 'NewExchangeInCoin',
            exclude: ['id'],
            optional: ['coinId']
          }),
        },
      },
    }) exchange: Omit<Exchange, 'id'>,
  ): Promise<Exchange> {
    return this.coinRepository.exchanges(id).create(exchange);
  }

  @patch('/coins/{id}/exchanges', {
    responses: {
      '200': {
        description: 'Coin.Exchange PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exchange, {partial: true}),
        },
      },
    })
    exchange: Partial<Exchange>,
    @param.query.object('where', getWhereSchemaFor(Exchange)) where?: Where<Exchange>,
  ): Promise<Count> {
    return this.coinRepository.exchanges(id).patch(exchange, where);
  }

  @del('/coins/{id}/exchanges', {
    responses: {
      '200': {
        description: 'Coin.Exchange DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Exchange)) where?: Where<Exchange>,
  ): Promise<Count> {
    return this.coinRepository.exchanges(id).delete(where);
  }
}
