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
import {Coin} from '../models';
import {CoinRepository, PrecioRepository} from '../repositories';

export class CoinController {
  constructor(
    @repository(CoinRepository)
    public coinRepository : CoinRepository,
    @repository(PrecioRepository)
    public precioRepository : PrecioRepository,
  ) {}

  @post('/coins')
  @response(200, {
    description: 'Coin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Coin)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coin, {
            title: 'NewCoin',
            exclude: ['id'],
          }),
        },
      },
    })
    coin: Omit<Coin, 'id'>,
  ): Promise<Coin> {
    return this.coinRepository.create(coin);
  }

  @get('/coins/count')
  @response(200, {
    description: 'Coin model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Coin) where?: Where<Coin>,
  ): Promise<Count> {
    return this.coinRepository.count(where);
  }

  @get('/coins')
  @response(200, {
    description: 'Array of Coin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Coin, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Coin) filter?: Filter<Coin>,
  ): Promise<Coin[]> {
    return this.coinRepository.find(filter);
  }

  @patch('/coins')
  @response(200, {
    description: 'Coin PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coin, {partial: true}),
        },
      },
    })
    coin: Coin,
    @param.where(Coin) where?: Where<Coin>,
  ): Promise<Count> {
    return this.coinRepository.updateAll(coin, where);
  }

  @get('/coins/{id}')
  @response(200, {
    description: 'Coin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Coin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Coin, {exclude: 'where'}) filter?: FilterExcludingWhere<Coin>
  ): Promise<Coin> {
    return this.coinRepository.findById(id, filter);
  }

  @patch('/coins/{id}')
  @response(204, {
    description: 'Coin PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coin, {partial: true}),
        },
      },
    })
    coin: Coin,
  ): Promise<void> {
    await this.coinRepository.updateById(id, coin);
  }

  @put('/coins/{id}')
  @response(204, {
    description: 'Coin PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() coin: Coin,
  ): Promise<void> {
    await this.coinRepository.replaceById(id, coin);
  }

  @del('/coins/{id}')
  @response(204, {
    description: 'Coin DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.coinRepository.deleteById(id);
  }
}
