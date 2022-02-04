import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {UserCoinRepository} from '../repositories';
import {UserCoin} from './../models/user-coin.model';

export class UsercoinController {
  constructor(
    @repository(UserCoinRepository)
    public userCoinRepository: UserCoinRepository,
  ) { }

  @post('/user-coins')
  @response(200, {
    description: 'UserCoin model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserCoin)}},
  })
  @authenticate({strategy: 'auth0-jwt'})
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
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
    const user: Partial<UserProfile> = {...currentUserProfile};
    const userid = user.sub.split("|")[1] || user.sub.split("|")[0]
    userCoin.userId = userid;
    userCoin.email = user["https://example.com/email"];
    const aUser = await this.userCoinRepository.findOne({where: {userId: userid, coinId: userCoin.coinId}});
    if (aUser == null) {
      console.log('agregada');
      return this.userCoinRepository.create(userCoin);

    }
    return aUser;

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

  @get('/my-coins')
  @response(200, {
    description: 'Coins for logued in user',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserCoin, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate({strategy: 'auth0-jwt'})
  async findMyCoins(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.filter(UserCoin) filter?: Filter<UserCoin>,
  ): Promise<UserCoin[]> {

    const user: Partial<UserProfile> = {...currentUserProfile};
    const userid = user.sub.split("|")[1] || user.sub.split("|")[0]

    // filter = filter.where({userId: userid})
    const usercoins = (await this.userCoinRepository.find(filter))
    // eslint-disable-next-line eqeqeq
    return (usercoins.filter(uc => uc.userId == userid))
    // return this.userCoinRepository.find(filter, {where: {userId: userid}})
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

  @del('/current-user-coins/{id}')
  @response(204, {
    description: 'Current UserCoin DELETE success',
  })
  @authenticate({strategy: 'auth0-jwt'})
  async deleteByCoinId(@param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile
  ): Promise<void> {
    const user: Partial<UserProfile> = {...currentUserProfile};
    const userid = user.sub.split("|")[1] || user.sub.split("|")[0]

    const ucoin = await this.userCoinRepository.findOne({where: {userId: userid, coinId: id}});

    await this.userCoinRepository.deleteById(ucoin?.id);
  }


  @patch('/current-user-coins/{id}')
  @response(204, {
    description: 'Current UserCoin PATCH success',
  })
  @authenticate({strategy: 'auth0-jwt'})
  async updateCurrentById(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCoin, {partial: true}),
        },
      },
    })
    userCoin: UserCoin,
  ): Promise<void> {
    const user: Partial<UserProfile> = {...currentUserProfile};
    const userid = user.sub.split("|")[1] || user.sub.split("|")[0]

    const ucoin = await this.userCoinRepository.findOne({where: {userId: userid, coinId: id}});

    if (ucoin && userCoin) {
      userCoin.coinId = id;
      userCoin.id = ucoin.id;
      userCoin.notified = false;

      await this.userCoinRepository.updateById(ucoin.id, userCoin);
    }
  }



}


