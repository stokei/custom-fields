export abstract class BaseViewModel<TObject = any> {
  abstract toJSON(): TObject;
}
