import { Sequelize, Transaction } from 'sequelize';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';
import { SequelizeUserRepository } from '~modules/user/infrastructure/persistence/sequelize/repositories/sequelize-user.repository';

export class SequelizeDbContext implements DbContext {
  private _sequelize: Sequelize;
  private _transaction: Transaction | null = null;
  private _userRepository: UserRepository | null = null;

  constructor(sequelize: Sequelize) {
    this._sequelize = sequelize;
    this.initRepositories();
  }

  private initRepositories() {
    this._userRepository = new SequelizeUserRepository(this._transaction);
  }

  get userRepository(): UserRepository {
    if (!this._userRepository) {
      throw new Error('User repository not initialized');
    }
    return this._userRepository;
  }

  public async startTransaction(): Promise<void> {
    if (this._transaction) {
      throw new Error('Transaction already started');
    }
    this._transaction = await this._sequelize.transaction();
    this.initRepositories();
  }

  public async commitTransaction(): Promise<void> {
    if (!this._transaction) {
      throw new Error('No transaction to commit');
    }
    await this._transaction.commit();
    this._transaction = null;
    this.initRepositories();
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this._transaction) {
      throw new Error('No transaction to rollback');
    }
    await this._transaction.rollback();
    this._transaction = null;
    this.initRepositories();
  }
}
