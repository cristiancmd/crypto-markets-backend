import {Model, model, property} from '@loopback/repository';

@model()
export class Test extends Model {
  @property({
    type: 'string',
    required: true,
  })
  script: string;

  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'number',

  })
  result?: number;

  constructor(data?: Partial<Test>) {
    super(data);
  }
}

export interface TestRelations {
  // describe navigational properties here
}

export type TestWithRelations = Test & TestRelations;
