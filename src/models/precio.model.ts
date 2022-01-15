import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Coin} from './coin.model';
import {Exchange} from './exchange.model';

@model()
export class Precio extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: Date;

  @property({
    type: 'number',
    required: true,
  })
  value: number;
  @belongsTo(() => Coin)
  coinId: string;

  @belongsTo(() => Exchange)
  exchangeId: string;

  constructor(data?: Partial<Precio>) {
    super(data);
  }
}

export interface PrecioRelations {
  // describe navigational properties here
}

export type PrecioWithRelations = Precio & PrecioRelations;
