import { MikroORM } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations';
import config from 'config/micro-orm/mikro-orm.config';
import { readdir } from 'fs/promises';
import path from 'path';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { MikroOrmDbContext } from '~core/infrastructure/persistence/mikro-orm/mikro-orm-db-context';

import { DbContextFactory, DbContextOptions } from './db-context.factory';

export class MikroOrmDbContextFactory extends DbContextFactory {
  private _orm: MikroORM | null = null;
  private options: DbContextOptions | null = null;

  async create(options: DbContextOptions): Promise<DbContext> {
    this._orm = await MikroORM.init({
      ...config,
      clientUrl: options.connectionString,
    });
    this.options = options;

    return new MikroOrmDbContext(this._orm);
  }

  public async migrate(): Promise<void> {
    if (!this.options) {
      throw new Error('Options not initialized');
    }

    const migrationFiles = (await readdir(path.join(process.cwd(), 'migrations/micro-orm'))).filter((file) =>
      file.endsWith('.ts'),
    );

    const importedMigration = await Promise.all(
      migrationFiles.map(async (file) => {
        const imported = await import(path.join(process.cwd(), `migrations/micro-orm/${file}`));
        return Object.values(imported)[0] as new (...args: unknown[]) => Migration;
      }),
    );

    this._orm = await MikroORM.init({
      ...config,
      clientUrl: this.options.connectionString,
      migrations: {
        ...config.migrations,
        migrationsList: importedMigration.map((migration) => ({
          name: migration.name,
          class: migration,
        })),
      },
    });

    await this._orm?.getMigrator().up();
  }

  public async close(): Promise<void> {
    await this._orm?.close();
  }
}
