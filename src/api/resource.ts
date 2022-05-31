export type Resource<T> = ResourceError | ResourceSuccess<T>

export class ResourceSuccess<T>{
  data: T;
  constructor(data: T) {
    this.data = data
  }
}

export class ResourceError {
  error: string
  constructor(error: string) {
    this.error = error
  }
}
