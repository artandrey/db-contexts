import { Transaction } from 'sequelize';

import { User, UserId } from '~modules/user/domain/entities/user.entity';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';

import { SequelizeUserMapper } from '../mappers/sequelize-user.mapper';
import { UserPersistenceEntity } from '../persistence-entities/user.persistence';

export class SequelizeUserRepository implements UserRepository {
  constructor(private readonly transaction: Transaction | null) {}

  async findAll(): Promise<User[]> {
    const users = await UserPersistenceEntity.findAll({
      transaction: this.transaction,
    });
    return users.map(SequelizeUserMapper.toDomain);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await UserPersistenceEntity.findByPk(id, {
      transaction: this.transaction,
    });
    return user ? SequelizeUserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const persistence = SequelizeUserMapper.toPersistence(user);
    const [savedUser] = await UserPersistenceEntity.upsert(persistence, {
      transaction: this.transaction,
    });
    return SequelizeUserMapper.toDomain(savedUser);
  }

  async delete(id: UserId): Promise<void> {
    await UserPersistenceEntity.destroy({
      where: { id },
      transaction: this.transaction,
    });
  }
}
