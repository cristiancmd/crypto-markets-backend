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
  Precio,
} from '../models';
import {CoinRepository} from '../repositories';

export class CoinPrecioController {
  constructor(
    @repository(CoinRepository) protected coinRepository: CoinRepository,
  ) { }

  @get('/coins/{id}/precios', {
    responses: {
      '200': {
        description: 'Array of Coin has many Precio',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Precio)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Precio>,
  ): Promise<Precio[]> {
    return this.coinRepository.precios(id).find(filter);
  }

  @post('/coins/{id}/precios', {
    responses: {
      '200': {
        description: 'Coin model instance',
        content: {'application/json': {schema: getModelSchemaRef(Precio)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Coin.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Precio, {
            title: 'NewPrecioInCoin',
            exclude: ['id'],
            optional: ['coinId']
          }),
        },
      },
    }) precio: Omit<Precio, 'id'>,
  ): Promise<Precio> {
    return this.coinRepository.precios(id).create(precio);
  }

  @patch('/coins/{id}/precios', {
    responses: {
      '200': {
        description: 'Coin.Precio PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Precio, {partial: true}),
        },
      },
    })
    precio: Partial<Precio>,
    @param.query.object('where', getWhereSchemaFor(Precio)) where?: Where<Precio>,
  ): Promise<Count> {
    return this.coinRepository.precios(id).patch(precio, where);
  }

  @del('/coins/{id}/precios', {
    responses: {
      '200': {
        description: 'Coin.Precio DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Precio)) where?: Where<Precio>,
  ): Promise<Count> {
    return this.coinRepository.precios(id).delete(where);
  }
}
