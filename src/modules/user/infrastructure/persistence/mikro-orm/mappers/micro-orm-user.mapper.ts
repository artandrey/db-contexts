import { User } from '~modules/user/domain/entities/user.entity';

import { UserPersistenceEntity } from '../persistence-entities/user.persistence';

export class MikroOrmUserMapper {
  public static toDomain(entity: UserPersistenceEntity): User {
    return new User(entity.name, entity.email, entity.age, entity.id);
  }

  public static toPersistence(domain: User): UserPersistenceEntity {
    return new UserPersistenceEntity(domain.name, domain.email, domain.age, domain.id);
  }
}
