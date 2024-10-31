import { EntityManager } from '@mikro-orm/core';

import { User, UserId } from '~modules/user/domain/entities/user.entity';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';

import { MikroOrmUserMapper } from '../mappers/micro-orm-user.mapper';
import { UserPersistenceEntity } from '../persistence-entities/user.persistence';

export class MikroOrmUserRepository implements UserRepository {
  private _entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this._entityManager = entityManager;
  }

  public async findAll(): Promise<User[]> {
    const entities = await this._entityManager.findAll(UserPersistenceEntity);
    return entities.map(MikroOrmUserMapper.toDomain);
  }

  public async findById(id: UserId): Promise<User | null> {
    const entity = await this._entityManager.findOne(UserPersistenceEntity, { id });
    return entity ? MikroOrmUserMapper.toDomain(entity) : null;
  }

  public async save(user: User): Promise<User> {
    const persistence = MikroOrmUserMapper.toPersistence(user);
    await this._entityManager.upsert(persistence);

    return MikroOrmUserMapper.toDomain(persistence);
  }

  public async delete(id: UserId): Promise<void> {
    const entity = await this._entityManager.findOne(UserPersistenceEntity, { id });
    if (entity) {
      await this._entityManager.removeAndFlush(entity);
    }
  }
}
