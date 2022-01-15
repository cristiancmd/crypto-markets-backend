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
import {UserCoin} from '../models';
import {UserCoinRepository} from '../repositories';

export class UsercoinController {
  constructor(
    @repository(UserCoinRepository)
    public userCoinRepository : UserCoinRepository,
  ) {}

  @post('/user-coins')
  @response(200, {
    description: 'UserCoin model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserCoin)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCoin, {
            title: 'NewUserCoin',
            exclude: ['id'],
          }),
        },
      },
    })
    userCoin: Omit<UserCoin, 'id'>,
  ): Promise<UserCoin> {
    return this.userCoinRepository.create(userCoin);
  }

  @get('/user-coins/count')
  @response(200, {
    description: 'UserCoin model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserCoin) where?: Where<UserCoin>,
  ): Promise<Count> {
    return this.userCoinRepository.count(where);
  }

  @get('/user-coins')
  @response(200, {
    description: 'Array of UserCoin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserCoin, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserCoin) filter?: Filter<UserCoin>,
  ): Promise<UserCoin[]> {
    return this.userCoinRepository.find(filter);
  }

  @patch('/user-coins')
  @response(200, {
    description: 'UserCoin PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCoin, {partial: true}),
        },
      },
    })
    userCoin: UserCoin,
    @param.where(UserCoin) where?: Where<UserCoin>,
  ): Promise<Count> {
    return this.userCoinRepository.updateAll(userCoin, where);
  }

  @get('/user-coins/{id}')
  @response(200, {
    description: 'UserCoin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserCoin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserCoin, {exclude: 'where'}) filter?: FilterExcludingWhere<UserCoin>
  ): Promise<UserCoin> {
    return this.userCoinRepository.findById(id, filter);
  }

  @patch('/user-coins/{id}')
  @response(204, {
    description: 'UserCoin PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCoin, {partial: true}),
        },
      },
    })
    userCoin: UserCoin,
  ): Promise<void> {
    await this.userCoinRepository.updateById(id, userCoin);
  }

  @put('/user-coins/{id}')
  @response(204, {
    description: 'UserCoin PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userCoin: UserCoin,
  ): Promise<void> {
    await this.userCoinRepository.replaceById(id, userCoin);
  }

  @del('/user-coins/{id}')
  @response(204, {
    description: 'UserCoin DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userCoinRepository.deleteById(id);
  }
}
