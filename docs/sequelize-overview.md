# Navigation

- Installation
- Running migrations
- Development experience

# Installation

To start using Sequelize, you need to install following packages:

- `sequelize`
- `sequelize-typescript` (for TypeScript support)
- `pg` (PostgreSQL driver)

Then you need to create a configuration file. Create it in `config/sequelize/sequelize.config.ts`:

```typescript
import { SequelizeOptions } from 'sequelize-typescript';

export type SequelizeConfig = {
  connectionString: string;
  options: SequelizeOptions;
};

const config: SequelizeConfig = {
  connectionString: process.env.DATABASE_URL!,
  options: {
    dialect: 'postgres',
    models: [], // Add your models here
    logging: false,
  },
};

export default config;
```

Note: Make sure to add your models to the configuration file's models array.

# Running migrations

Sequelize code migration works well for local development.

```typescript
const sequelize = new Sequelize(/* config */);
// this is applicable only for local development
sequelize.sync({ force: true });
```

> [!WARN]
> Sequelize lacks official support for typescript. There is a package `sequelize-typescript-migration` that adds ability to generate migrations from typescript models.
> But it is not actively maintained.
> Also, overall experience with typescript is not smooth. I even was forced to use a workaround to resolve type issues during ORM usage.

# Development experience

Sequelize provides a robust ORM which is nice to use with JavaScript.
It offers features like eager loading and transactions.
However, to use it with TypeScript you will need to use `sequelize-typescript` package.
The decorator-based approach with `sequelize-typescript` makes it familiar for TypeScript developers.
Unfortunately, there is no official support for TypeScript in Sequelize and there are some issues with types and migrations.
