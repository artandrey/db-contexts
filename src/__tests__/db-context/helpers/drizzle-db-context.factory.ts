import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { Client } from 'pg';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { DrizzleDbContext } from '~core/infrastructure/persistence/drizzle/drizzle-db-context';
import * as schema from '~core/infrastructure/persistence/drizzle/schema';

import { DbContextFactory, DbContextOptions } from './db-context.factory';

export class DrizzleDbContextFactory extends DbContextFactory {
  private client: Client | null = null;
  private db: NodePgDatabase<typeof schema> | null = null;

  async create(options: DbContextOptions): Promise<DbContext> {
    this.client = new Client({
      connectionString: options.connectionString,
    });
    await this.client.connect();
    this.db = drizzle(this.client, { schema });
    return new DrizzleDbContext(this.db);
  }

  async migrate(): Promise<void> {
    if (!this.db) {
      throw new Error('Db not initialized');
    }

    await migrate(this.db, {
      migrationsFolder: path.join(process.cwd(), 'migrations/drizzle'),
    });
  }

  async close(): Promise<void> {
    await this.client?.end();
  }
}
