import {Entity, hasMany, model, property} from '@loopback/repository';
import {Exchange} from './exchange.model';
import {Precio} from './precio.model';

@model()
export class Coin extends Entity {
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  symbol?: string;

  @property({
    type: 'string',
  })
  icon?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  wikiUrl?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
  })
  avgPrice?: number;

  @property({
    type: 'string',
  })
  miniChart?: string;

  @property({
    type: 'Date',
    default: new Date(Date.now() - (72 * 3600000))
  })
  lastChart?: Date;

  @hasMany(() => Exchange)
  exchanges: Exchange[];

  @hasMany(() => Precio)
  precios: Precio[];



  constructor(data?: Partial<Coin>) {
    super(data);
  }
}

export interface CoinRelations {
  // describe navigational properties here
}

export type CoinWithRelations = Coin & CoinRelations;
