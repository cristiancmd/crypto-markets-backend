import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Coin, User, UserRelations, UserCoin} from '../models';
import {CoinRepository} from './coin.repository';
import {UserCoinRepository} from './user-coin.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly coins: HasManyRepositoryFactory<Coin, typeof User.prototype.id>;

  public readonly usercoins: HasManyThroughRepositoryFactory<Coin, typeof Coin.prototype.id,
          UserCoin,
          typeof User.prototype.id
        >;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource, @repository.getter('CoinRepository') protected coinRepositoryGetter: Getter<CoinRepository>, @repository.getter('UserCoinRepository') protected userCoinRepositoryGetter: Getter<UserCoinRepository>,
  ) {
    super(User, dataSource);
    this.usercoins = this.createHasManyThroughRepositoryFactoryFor('usercoins', coinRepositoryGetter, userCoinRepositoryGetter,);
    this.registerInclusionResolver('usercoins', this.usercoins.inclusionResolver);

  }
}
