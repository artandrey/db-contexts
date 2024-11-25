# Navigation

- [Installation](#installation)
- [Running migrations](#running-migrations)
- [Development experience](#development-experience)

# Installation

To start using MikroORM, you need to install following packages:

- `@mikro-orm/core`
- `@mikro-orm/postgresql`
- `@mikro-orm/reflection`
- `@mikro-orm/migrations`
- `ts-node`
- `tsconfig-paths`
- `@mikro-orm/cli` <- not sure that we need it, cause cli only works with custom typescript configuration

Then you need to configure **tsconfig.json** to use MikroORM with reflection.
And also configure tsconfig-paths plugin to resolve paths in the project during running migration stript.

```json
{
  "compilerOptions": {
    // ... rest of the options
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "ts-node": {
    "require": ["tsconfig-paths/register"] // setup to resolve paths in the project
  }
}
```

After that we will need to create **mikro-orm.config.ts** file in the root of the project and configure connection to the database.

```typescript
const config = defineConfig({
  extensions: [Migrator], // add migrator extension to be able to run migrations
  entities: [UserPersistenceEntity], // add all entities that we have in the project
  metadataCache: {
    options: {
      cacheDir: './.mikro-orm-cache', // reconfigure cache directory

    },
    //enabled: false, <- or disable metadata cache, but it's better to keep it enabled for performance reasons
  },
  migrations: {
    pathTs: path.join(process.cwd(), 'migrations/micro-orm'), // configure path to the migrations
    glob: '.{ts}', // configure matching pattern for migration files
  },
  metadataProvider: TsMorphMetadataProvider,
  clientUrl: process.env.POSTGRES_URL,
  driver: PostgreSqlDriver,
});

export default config;
`
```

> [!WARNING]
> MikroORM migrations are tricky to setup, cause they require custom typescript configuration.
> Try to avoid changing anything in the default configuration unless you know what you are doing.

# Running migrations

Running migrations using cli is not working with current typescript configuration, so we need to run migrations with `ts-node` directly.

**Create migration**
Note: you need to have running database to be able to create migrations. That's may be impractical in the development process.

```bash
pnpm ts-node ./scripts/mikro-orm/create-migration.ts
```

**Push migration**

```bash
pnpm ts-node ./scripts/mikro-orm/push-migration.ts
```

# Development experience

MikroORM allows us to define population strategies for entities with ease and it supports mapping to actual classes.
It eliminates the need to manually manage nested entities operations. Also it is important to mention support of unit of work pattern out of the box.

From the other side there are many limitations, that requires you to write code for MikroORM, not with MikroORM. For example migrations are tricky to setup with typescript path aliases.
Also, operations with entities are separated into those that use the ORM cache and those that are performed directly on the database.
It may be hard to onboard developers, cause they will need to understand how to use ORM cache and when to perform direct database operations.
Example:

```typescript
const user = await orm.em.persistAndFlush(new User()); // this will use ORM cache
```

```typescript
const user = await orm.em.insert(User, { id: 1 }); // this will perform direct database operation
```
