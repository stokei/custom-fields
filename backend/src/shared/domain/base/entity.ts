import { UniqueEntityID } from '../utils/unique-entity-id';

export abstract class Entity<TProps> {
  protected readonly _id: UniqueEntityID;
  protected readonly props: TProps;

  constructor(props: TProps, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
    Object.assign(this as unknown as Entity<TProps> & TProps, props);
  }

  get id(): string {
    return this._id.toString();
  }

  equals(entity?: Entity<TProps>): boolean {
    if (!entity) return false;
    return this._id.equals(entity._id);
  }
}
