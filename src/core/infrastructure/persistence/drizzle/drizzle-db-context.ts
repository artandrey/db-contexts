/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';
import { DrizzleUserRepository } from '~modules/user/infrastructure/persistence/drizzle/repositories/drizzle-user.repository';

type PromiseWithResolvers<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

function withResolvers<T>(): PromiseWithResolvers<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

export class DrizzleDbContext implements DbContext {
  private _db: NodePgDatabase<any>;
  private _transaction: NodePgDatabase<any> | null = null;
  private _transactionPromise: Promise<unknown> | null = null;
  private _transactionCompletionPromise: PromiseWithResolvers<void> | null = null;

  private _userRepository: UserRepository | null = null;

  get userRepository() {
    if (!this._userRepository) {
      throw new Error('User repository not initialized');
    }
    return this._userRepository;
  }

  constructor(db: NodePgDatabase<any>) {
    this._db = db;
    this.initRepositories();
  }

  public async commitTransaction(): Promise<void> {
    if (!this._transactionCompletionPromise || !this._transactionPromise) {
      throw new Error('No transaction to commit');
    }
    this._transactionCompletionPromise.resolve();
    await Promise.allSettled([this._transactionPromise]);
    this._transaction = null;
    this._transactionPromise = null;
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this._transactionCompletionPromise || !this._transactionPromise) {
      throw new Error('No transaction to rollback');
    }
    this._transactionCompletionPromise.reject();
    await Promise.allSettled([this._transactionPromise]);
    this._transaction = null;
    this._transactionPromise = null;
  }

  public async startTransaction(): Promise<void> {
    if (this._transactionPromise) {
      throw new Error('Transaction already started');
    }

    const { promise: retrieveTransactionPromise, resolve: resolveRetrieveTransaction } =
      withResolvers<NodePgDatabase<any>>();

    this._transactionCompletionPromise = withResolvers<void>();

    this._transactionPromise = this._db.transaction(async (tx) => {
      resolveRetrieveTransaction(tx);
      if (!this._transactionCompletionPromise) {
        throw new Error('Failed to start transaction');
      }
      const { promise } = this._transactionCompletionPromise;
      await promise;
    });

    this._transaction = await retrieveTransactionPromise;

    this.initRepositories();
  }

  private get dataSource() {
    return this._transaction ?? this._db;
  }

  private initRepositories() {
    this._userRepository = new DrizzleUserRepository(this.dataSource);
  }
}
