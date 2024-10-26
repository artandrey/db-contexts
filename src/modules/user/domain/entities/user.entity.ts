import { BaseEntity } from '~core/domain/entities/base.entity';

export type UserId = string & { __brand: 'UserId' };

export class User extends BaseEntity<UserId> {
  constructor(
    id: UserId,
    public readonly name: string,
    public readonly email: string,
    public readonly age: number,
  ) {
    super(id);
  }
}
