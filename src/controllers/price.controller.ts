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
import {Precio} from '../models';
import {PrecioRepository} from '../repositories';

export class PriceController {
  constructor(
    @repository(PrecioRepository)
    public precioRepository : PrecioRepository,
  ) {}

  @post('/precios')
  @response(200, {
    description: 'Precio model instance',
    content: {'application/json': {schema: getModelSchemaRef(Precio)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Precio, {
            title: 'NewPrecio',
            exclude: ['id'],
          }),
        },
      },
    })
    precio: Omit<Precio, 'id'>,
  ): Promise<Precio> {
    return this.precioRepository.create(precio);
  }

  @get('/precios/count')
  @response(200, {
    description: 'Precio model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Precio) where?: Where<Precio>,
  ): Promise<Count> {
    return this.precioRepository.count(where);
  }

  @get('/precios')
  @response(200, {
    description: 'Array of Precio model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Precio, {includeRelations: false}),
        },
      },
    },
  })
  async find(
    @param.filter(Precio) filter?: Filter<Precio>,
  ): Promise<Precio[]> {
    return this.precioRepository.find(filter);
  }

  @patch('/precios')
  @response(200, {
    description: 'Precio PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Precio, {partial: true}),
        },
      },
    })
    precio: Precio,
    @param.where(Precio) where?: Where<Precio>,
  ): Promise<Count> {
    return this.precioRepository.updateAll(precio, where);
  }

  @get('/precios/{id}')
  @response(200, {
    description: 'Precio model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Precio, {includeRelations: false}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Precio, {exclude: 'where'}) filter?: FilterExcludingWhere<Precio>
  ): Promise<Precio> {
    return this.precioRepository.findById(id, filter);
  }

  @patch('/precios/{id}')
  @response(204, {
    description: 'Precio PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Precio, {partial: true}),
        },
      },
    })
    precio: Precio,
  ): Promise<void> {
    await this.precioRepository.updateById(id, precio);
  }

  @put('/precios/{id}')
  @response(204, {
    description: 'Precio PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() precio: Precio,
  ): Promise<void> {
    await this.precioRepository.replaceById(id, precio);
  }

  @del('/precios/{id}')
  @response(204, {
    description: 'Precio DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.precioRepository.deleteById(id);
  }
}
