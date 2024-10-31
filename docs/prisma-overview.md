# Navigation

- [Installation](#installation)
- [Running migrations](#running-migrations)
- [Development experience](#development-experience)

# Installation

To start using Prisma, you need to install following packages:

- `prisma`
- `@prisma/client`

Run `npx prisma init`

Then you need to define your database schema in the **schema.prisma** file and configure the connection:
By default it will be created in the root of the project, but I prefer to create it in the **src/core/infrastructure/persistence/prisma** folder.

Note: if you want to change the default location, you can do it in the **package.json** file:

```json
{
  "prisma": {
    "schema": "./src/core/infrastructure/persistence/prisma/schema.prisma"
  }
}
```

Overall setup process was easy and straightforward.

# Running migrations

Cli works well for local development, but it requires running database to generate migrations.

To create migrations you will need to run database and apply following command:

```bash
npx prisma migrate dev
```

> [!INFO]
>
> `npx prisma migrate dev`
> will create and apply migrations to the database.

Make sure that you have DATABASE_URL environment variable available. You can set it in the **.env** file or directly in the environment.

To apply migrations in production you can use following command:

```bash
npx prisma migrate deploy
```

Also make sure that you have DATABASE_URL environment variable available.

# Development experience

Prisma is simple and functional at the same time. It supports loading strategies and nested inserts/updates.
Another important feature is its custom schema syntax, which provides a comfortable starting point for developers.
Automatic type-safe client generation is also nice feature to have. Sometimes it may require to restart typescript server to pick up the changes, but it's not a big deal.

On the other hand, Prisma's schema abstraction layer means you may not have access to some database-specific features.
Also configuration may be not to flexible sometimes, but it's not enforce you to brake existing project settings.
