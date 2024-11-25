import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { PrismaDbContext } from '~core/infrastructure/persistence/prisma/prisma-db-context';

import { DbContextFactory, DbContextOptions } from './db-context.factory';

export class PrismaDbContextFactory extends DbContextFactory {
  private _prisma: PrismaClient | null = null;
  private _options: DbContextOptions | null = null;

  async create(options: DbContextOptions): Promise<DbContext> {
    this._prisma = new PrismaClient({
      datasources: {
        db: {
          url: options.connectionString,
        },
      },
    });
    this._options = options;

    return new PrismaDbContext(this._prisma);
  }

  async migrate(): Promise<void> {
    if (!this._options) {
      throw new Error('DbContext options not initialized');
    }
    process.env.DATABASE_URL = this._options.connectionString;
    execSync('npx prisma migrate deploy');
  }

  async close(): Promise<void> {
    await this._prisma?.$disconnect();
  }
}
