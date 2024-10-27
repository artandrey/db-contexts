import { BaseEntity } from '~core/domain/entities/base.entity';

export type UserId = string & { __brand: 'UserId' };

export class User extends BaseEntity<UserId> {
  private _name: string;
  private _email: string;
  private _age: number;

  constructor(name: string, email: string, age: number, id?: UserId) {
    super(id);
    this._name = name;
    this._email = email;
    this._age = age;
  }

  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }

  get email(): string {
    return this._email;
  }
  set email(email: string) {
    this._email = email;
  }

  get age(): number {
    return this._age;
  }
  set age(age: number) {
    this._age = age;
  }
}
