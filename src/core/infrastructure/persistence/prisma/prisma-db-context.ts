import { PrismaClient } from '@prisma/client';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';
import { PrismaUserRepository } from '~modules/user/infrastructure/persistence/prisma/repositories/prisma-user.repository';

export type PrismaDataSource = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

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

export class PrismaDbContext implements DbContext {
  private _prisma: PrismaClient;
  private _transaction: PrismaDataSource | null = null;
  private _transactionPromise: Promise<unknown> | null = null;
  private _transactionCompletionPromise: PromiseWithResolvers<void> | null = null;
  private _userRepository: UserRepository | null = null;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
    this.initRepositories();
  }

  private get dataSource() {
    return this._transaction ?? this._prisma;
  }

  private initRepositories() {
    this._userRepository = new PrismaUserRepository(this.dataSource);
  }

  get userRepository(): UserRepository {
    if (!this._userRepository) {
      throw new Error('User repository not initialized');
    }
    return this._userRepository;
  }

  public async startTransaction(): Promise<void> {
    if (this._transactionPromise) {
      throw new Error('Transaction already started');
    }

    const { promise: retrieveTransactionPromise, resolve: resolveRetrieveTransaction } =
      withResolvers<PrismaDataSource>();

    this._transactionCompletionPromise = withResolvers<void>();

    this._transactionPromise = this._prisma.$transaction(async (tx) => {
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

  public async commitTransaction(): Promise<void> {
    if (!this._transactionCompletionPromise || !this._transactionPromise) {
      throw new Error('No transaction to commit');
    }
    this._transactionCompletionPromise.resolve();
    await Promise.allSettled([this._transactionPromise]);
    this._transaction = null;
    this._transactionPromise = null;
    this._transactionCompletionPromise = null;
    this.initRepositories();
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this._transactionCompletionPromise || !this._transactionPromise) {
      throw new Error('No transaction to rollback');
    }
    this._transactionCompletionPromise.reject(new Error('Transaction rolled back'));
    await Promise.allSettled([this._transactionPromise]);
    this._transaction = null;
    this._transactionPromise = null;
    this._transactionCompletionPromise = null;
    this.initRepositories();
  }
}
