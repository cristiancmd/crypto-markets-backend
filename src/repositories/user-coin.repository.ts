import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {UserCoin, UserCoinRelations} from '../models';

export class UserCoinRepository extends DefaultCrudRepository<
  UserCoin,
  typeof UserCoin.prototype.id,
  UserCoinRelations
> {
  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
  ) {
    super(UserCoin, dataSource);
  }
}
