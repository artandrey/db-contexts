export abstract class BaseEntity<TId> {
  private readonly _id!: TId;

  constructor(id?: TId) {
    if (id) {
      this._id = id;
    }
  }

  get id(): TId {
    return this._id;
  }

  equals(entity: BaseEntity<TId>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (!entity.id || !this.id) {
      return false;
    }

    return entity.id === this.id;
  }
}
