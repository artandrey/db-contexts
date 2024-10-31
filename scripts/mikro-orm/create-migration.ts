import { MikroORM } from '@mikro-orm/core';
import config from 'config/micro-orm/mikro-orm.config';

const createMigration = async () => {
  const orm = MikroORM.initSync(config);

  const migrator = orm.getMigrator();
  await migrator.createMigration();
};

createMigration();
