import { User } from '~modules/user/domain/entities/user.entity';

import { UserPersistenceEntity } from '../persistence-entities/user.persistence';

export class SequelizeUserMapper {
  static toDomain(entity: UserPersistenceEntity): User {
    return new User(entity.name, entity.email, entity.age, entity.id);
  }

  static toPersistence(domain: User): UserPersistenceEntity {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      age: domain.age,
    } as UserPersistenceEntity;
  }
}
