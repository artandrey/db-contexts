# Navigation

- [Installation](#installation)
- [Schema Setup](#schema-setup)
- [Running Migrations](#running-migrations)
- [Development Experience](#development-experience)
- [Comparison with Prisma](#comparison-with-prisma)

# Installation

To start using Drizzle ORM, you need to install the following packages:

- `drizzle-orm` - The core ORM package
- `drizzle-kit` - Development tools for migrations and schema management
- `pg` - PostgreSQL driver
- `@types/pg` - PostgreSQL driver types

To generate the schema, you need to create a **drizzle.config.ts** file.
By default it will be created in the root of the project, but I prefer to create it in the **src/core/infrastructure/persistence/drizzle** folder.

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/core/infrastructure/persistence/drizzle/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
});
```

For the first time it may require you to read the documentation to setup the ORM.

# Running Migrations

Migrations generation does not require you to have a running database, which is very handy for development.

To generate migrations you will need to run the following command:

```bash
npx drizzle-kit generate
```

or if you have a custom configuration file:

```bash
npx drizzle-kit generate --config ./config/drizzle/drizzle.config.ts
```

To run the migrations you will need to run the following command:

```bash
npx drizzle-kit migrate
```

Also running migrations programmatically is possible, that is useful for testing.

# Development Experience

Drizzle is simple and reminds SQL syntax.

> [!NOTE]
> If you don't know how to do it with Drizzle, just think how you would do it with raw SQL.
> And you will come up with the drizzle solution.

You have maximum control over the database, which is very handy for complex queries.

From the other hand, multiple highly demanded features are not supported out of the box. It may take more time to implement some database operation using drizzle compared to other ORMs.
Drizzle does not support nested inserts and updates, so you will need to implement them manually.

This ORM is nice choice for serverless or high-load applications due to its performance.
But we should keep in mind that it supports only relational databases.
