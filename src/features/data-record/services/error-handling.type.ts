export type Result<T, E> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return !this.isSuccess();
  }

  mapSuccess<A>(f: (t: T) => A): Result<A, E> {
    return success(f(this.value));
  }

  mapFailure<U>(ignoreFunc: (e: E) => U): Result<T, U> {
    return success(this.value);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Failure<T, E> {
  private error: E;

  constructor(error: E) {
    this.error = error;
  }

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return !this.isSuccess();
  }

  mapSuccess<A>(ignoreFunc: (t: T) => A): Result<A, E> {
    return failure(this.error);
  }

  mapFailure<U>(f: (e: E) => U): Result<T, U> {
    return failure(f(this.error));
  }
}

export const success = <T, E>(value: T): Result<T, E> => new Success(value);
export const failure = <T, E>(error: E): Result<T, E> => new Failure(error);
