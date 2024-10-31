import { EntityManager, IsolationLevel, MikroORM } from '@mikro-orm/core';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';
import { MikroOrmUserRepository } from '~modules/user/infrastructure/persistence/mikro-orm/repositories/mikro-orm-user.repository';

export class MikroOrmDbContext implements DbContext {
  private _orm: MikroORM;
  private _entityManager: EntityManager;

  private _userRepository: UserRepository | null = null;

  constructor(orm: MikroORM) {
    this._orm = orm;
    this._entityManager = this._orm.em.fork({ clear: true });
    this.initRepositories();
  }

  public initRepositories() {
    this._userRepository = new MikroOrmUserRepository(this._entityManager);
  }

  get userRepository(): UserRepository {
    if (!this._userRepository) {
      throw new Error('User repository not initialized');
    }
    return this._userRepository;
  }

  public async startTransaction(): Promise<void> {
    if (this._entityManager.getTransactionContext()) {
      throw new Error('Transaction already started');
    }
    this._entityManager.clear();
    await this._entityManager.begin({ isolationLevel: IsolationLevel.REPEATABLE_READ });
    this.initRepositories();
  }

  public async commitTransaction(): Promise<void> {
    if (!this._entityManager.getTransactionContext()) {
      throw new Error('No transaction to commit');
    }
    await this._entityManager.commit();
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this._entityManager.getTransactionContext()) {
      throw new Error('No transaction to rollback');
    }
    this._entityManager.clear();
    await this._entityManager.rollback();
  }
}
