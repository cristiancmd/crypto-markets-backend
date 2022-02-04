import {Entity, model, property} from '@loopback/repository';

@model()
export class UserCoin extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  coinId?: string;

  @property({
    type: 'number',
  })
  max?: number;

  @property({
    type: 'number',
  })
  min?: number;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'boolean',

  })
  notified?: boolean;

  constructor(data?: Partial<UserCoin>) {
    super(data);
  }
}

export interface UserCoinRelations {
  // describe navigational properties here
}

export type UserCoinWithRelations = UserCoin & UserCoinRelations;
