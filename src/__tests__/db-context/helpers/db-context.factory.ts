import { DbContext } from '~core/application/db-context/db-context.interface';

export interface DbContextOptions {
  connectionString: string;
}

export abstract class DbContextFactory {
  abstract create(options: DbContextOptions): Promise<DbContext>;
  abstract migrate(): Promise<void>;
  abstract close(): Promise<void>;
}
