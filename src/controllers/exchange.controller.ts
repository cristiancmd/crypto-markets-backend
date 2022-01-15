import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Exchange} from '../models';
import {ExchangeRepository} from '../repositories';

export class ExchangeController {
  constructor(
    @repository(ExchangeRepository)
    public exchangeRepository : ExchangeRepository,
  ) {}

  @post('/exchanges')
  @response(200, {
    description: 'Exchange model instance',
    content: {'application/json': {schema: getModelSchemaRef(Exchange)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exchange, {
            title: 'NewExchange',
            exclude: ['id'],
          }),
        },
      },
    })
    exchange: Omit<Exchange, 'id'>,
  ): Promise<Exchange> {
    return this.exchangeRepository.create(exchange);
  }

  @get('/exchanges/count')
  @response(200, {
    description: 'Exchange model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Exchange) where?: Where<Exchange>,
  ): Promise<Count> {
    return this.exchangeRepository.count(where);
  }

  @get('/exchanges')
  @response(200, {
    description: 'Array of Exchange model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Exchange, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Exchange) filter?: Filter<Exchange>,
  ): Promise<Exchange[]> {
    return this.exchangeRepository.find(filter);
  }

  @patch('/exchanges')
  @response(200, {
    description: 'Exchange PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exchange, {partial: true}),
        },
      },
    })
    exchange: Exchange,
    @param.where(Exchange) where?: Where<Exchange>,
  ): Promise<Count> {
    return this.exchangeRepository.updateAll(exchange, where);
  }

  @get('/exchanges/{id}')
  @response(200, {
    description: 'Exchange model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Exchange, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Exchange, {exclude: 'where'}) filter?: FilterExcludingWhere<Exchange>
  ): Promise<Exchange> {
    return this.exchangeRepository.findById(id, filter);
  }

  @patch('/exchanges/{id}')
  @response(204, {
    description: 'Exchange PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exchange, {partial: true}),
        },
      },
    })
    exchange: Exchange,
  ): Promise<void> {
    await this.exchangeRepository.updateById(id, exchange);
  }

  @put('/exchanges/{id}')
  @response(204, {
    description: 'Exchange PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() exchange: Exchange,
  ): Promise<void> {
    await this.exchangeRepository.replaceById(id, exchange);
  }

  @del('/exchanges/{id}')
  @response(204, {
    description: 'Exchange DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.exchangeRepository.deleteById(id);
  }
}
