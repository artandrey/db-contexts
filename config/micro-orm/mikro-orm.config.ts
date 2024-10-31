import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import path from 'path';

import { UserPersistenceEntity } from '~modules/user/infrastructure/persistence/mikro-orm/persistence-entities/user.persistence';

const config = defineConfig({
  extensions: [Migrator],
  entities: [UserPersistenceEntity],
  metadataCache: {
    options: {
      cacheDir: './.mikro-orm-cache',
    },
  },
  migrations: {
    pathTs: path.join(process.cwd(), 'migrations/micro-orm'),
    glob: '.{ts}',
  },
  metadataProvider: TsMorphMetadataProvider,
  clientUrl: process.env.POSTGRES_URL,
  driver: PostgreSqlDriver,
});

export default config;
