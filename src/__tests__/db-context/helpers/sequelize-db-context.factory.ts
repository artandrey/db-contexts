import config from 'config/sequelize/sequelize.config';
import { Sequelize } from 'sequelize-typescript';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { SequelizeDbContext } from '~core/infrastructure/persistence/sequelize/sequelize-db-context';

import { DbContextFactory, DbContextOptions } from './db-context.factory';

export class SequelizeDbContextFactory extends DbContextFactory {
  private sequelize: Sequelize | null = null;

  async create(options: DbContextOptions): Promise<DbContext> {
    this.sequelize = new Sequelize(options.connectionString, {
      ...config.options,
    });

    await this.sequelize.authenticate();
    return new SequelizeDbContext(this.sequelize);
  }

  async migrate(): Promise<void> {
    if (!this.sequelize) {
      throw new Error('Sequelize not initialized');
    }
    await this.sequelize.sync({ force: true });
  }

  async close(): Promise<void> {
    await this.sequelize?.close();
  }
}
