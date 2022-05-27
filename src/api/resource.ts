export type ResourceState<T> = ResourceError | ResourceSuccess<T>

export class Resource {
  static ok<U>(data: U): ResourceSuccess<U> {
    return new ResourceSuccess(data)
  }

  static error(error: string): ResourceError {
    return new ResourceError(error)
  }
}

export class ResourceSuccess<T>{
  data: T;
  constructor(data: T) {
    this.data = data
  }
}

export class ResourceError {
  error: string;
  constructor(error: string) {
    this.error = error
  }
}
