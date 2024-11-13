export abstract class Factory<T> {
  abstract make(data?: Partial<T>): Promise<T>;
  abstract makeMany(count: number, data?: Partial<T>): Promise<T[]>;
}
