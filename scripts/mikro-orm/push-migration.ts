import { MikroORM } from '@mikro-orm/core';
import config from 'config/micro-orm/mikro-orm.config';

const pushMigration = async () => {
  const connectionString = process.argv[2];

  const orm = MikroORM.initSync({
    ...config,
    dbName: connectionString ? undefined : config.dbName,
    clientUrl: connectionString,
  });

  const migrator = orm.getMigrator();
  await migrator.up();
  await orm.close();
};

pushMigration();
