import { Migration } from '@mikro-orm/migrations';

export class Migration20241030213727 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "age" int not null, constraint "users_pkey" primary key ("id"));`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
