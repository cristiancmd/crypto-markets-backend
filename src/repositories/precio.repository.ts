import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Precio, PrecioRelations, Coin, Exchange} from '../models';
import {CoinRepository} from './coin.repository';
import {ExchangeRepository} from './exchange.repository';

export class PrecioRepository extends DefaultCrudRepository<
  Precio,
  typeof Precio.prototype.id,
  PrecioRelations
> {

  public readonly coin: BelongsToAccessor<Coin, typeof Precio.prototype.id>;

  public readonly exchange: BelongsToAccessor<Exchange, typeof Precio.prototype.id>;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource, @repository.getter('CoinRepository') protected coinRepositoryGetter: Getter<CoinRepository>, @repository.getter('ExchangeRepository') protected exchangeRepositoryGetter: Getter<ExchangeRepository>,
  ) {
    super(Precio, dataSource);
    this.exchange = this.createBelongsToAccessorFor('exchange', exchangeRepositoryGetter,);
    this.registerInclusionResolver('exchange', this.exchange.inclusionResolver);
    this.coin = this.createBelongsToAccessorFor('coin', coinRepositoryGetter,);
    this.registerInclusionResolver('coin', this.coin.inclusionResolver);
  }
}
