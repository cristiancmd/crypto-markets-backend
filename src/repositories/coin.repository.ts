import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Coin, CoinRelations, Exchange, Precio} from '../models';
import {ExchangeRepository} from './exchange.repository';
import {PrecioRepository} from './precio.repository';

export class CoinRepository extends DefaultCrudRepository<
  Coin,
  typeof Coin.prototype.id,
  CoinRelations
> {

  public readonly exchanges: HasManyRepositoryFactory<Exchange, typeof Coin.prototype.id>;

  public readonly precios: HasManyRepositoryFactory<Precio, typeof Coin.prototype.id>;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource, @repository.getter('ExchangeRepository') protected exchangeRepositoryGetter: Getter<ExchangeRepository>, @repository.getter('PrecioRepository') protected precioRepositoryGetter: Getter<PrecioRepository>,
  ) {
    super(Coin, dataSource);
    this.precios = this.createHasManyRepositoryFactoryFor('precios', precioRepositoryGetter,);
    this.registerInclusionResolver('precios', this.precios.inclusionResolver);
    
    this.exchanges = this.createHasManyRepositoryFactoryFor('exchanges', exchangeRepositoryGetter,);
    this.registerInclusionResolver('exchanges', this.exchanges.inclusionResolver);
  }
}
