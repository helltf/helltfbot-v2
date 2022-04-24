export class Resource<T> {
	data: T | undefined
	success: boolean
	error: string | undefined

	constructor(success: boolean, data?: T, error?: string) {
		this.data = data
		this.error = error
		this.success = success
	}

	static ok<U>(data: U): Resource<U> {
		return new Resource(true, data, undefined)
	}

	static error<U>(error: string): Resource<U> {
		return new Resource(true, undefined, error)
	}
}
