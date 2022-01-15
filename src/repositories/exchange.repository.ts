import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Exchange, ExchangeRelations} from '../models';

export class ExchangeRepository extends DefaultCrudRepository<
  Exchange,
  typeof Exchange.prototype.id,
  ExchangeRelations
> {
  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
  ) {
    super(Exchange, dataSource);
  }
}
