import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

import { UserId } from '~modules/user/domain/entities/user.entity';

@Entity({ tableName: 'users' })
export class UserPersistenceEntity {
  @PrimaryKey({ type: 'uuid' })
  id: UserId = randomUUID() as UserId;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  age!: number;

  constructor(name: string, email: string, age: number, id?: UserId) {
    if (id) {
      this.id = id;
    }
    this.name = name;
    this.email = email;
    this.age = age;
  }
}
