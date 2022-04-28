export interface Module {
	initialize: () => any | Promise<any>,
	name: string
}
