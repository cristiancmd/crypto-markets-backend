import {Entity, hasMany, model, property} from '@loopback/repository';
import {Coin} from './coin.model';
import {UserCoin} from './user-coin.model';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    required: false,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
  })
  username: string;

  @property({
    type: 'string',
    required: false,
  })
  password?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  sub?: string;

  @hasMany(() => Coin, {through: {model: () => UserCoin}})
  usercoins: Coin[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
