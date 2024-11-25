import { User } from '~modules/user/domain/entities/user.entity';

import { UserPersistence } from '../schema/types';

export class DrizzleUserMapper {
  static toDomain(user: UserPersistence): User {
    return new User(user.name, user.email, user.age, user.id);
  }

  static toPersistence(user: User): UserPersistence {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    };
  }
}
