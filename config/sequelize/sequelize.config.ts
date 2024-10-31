import { SequelizeOptions } from 'sequelize-typescript';

import { UserPersistenceEntity } from '~modules/user/infrastructure/persistence/sequelize/persistence-entities/user.persistence';

export type SequelizeConfig = {
  connectionString: string;
  options: SequelizeOptions;
};

const config: SequelizeConfig = {
  connectionString: process.env.DATABASE_URL!,
  options: {
    dialect: 'postgres',
    models: [UserPersistenceEntity],
    logging: false,
  },
};

export default config;
