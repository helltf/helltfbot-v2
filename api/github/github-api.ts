import fetch from 'node-fetch'
import { Projects } from './github-projects'

const getPipeLineData = async (project: Projects): Promise<PipelineData> => {
    let test = Resource.ok(new PipelineData([]))

	let result = await (await fetch(process.env[project], {
		method: 'GET',
		headers: {
			Authorization: 'token ' + process.env.GITHUB_TOKEN,
		},
	})).json()
	return new PipelineData(result)
}

const requestGithubApi = (path: string): Promise<any> => {

}

class PipelineData {
	constructor(result: any) {

    }
}
class Resource<T>{
    data:T | undefined
    success: boolean
    error: string | undefined
    constructor(success: boolean, data: T | undefined, error: string | undefined){
        this.data = data
        this.error = error
        this.success = success
    }
    static ok<U>(data: U): Resource<U>{
        return new Resource(true, data, undefined)
    }
    static error<U>(error: string): Resource<U>{
        return new Resource(true, undefined, error)
    }
}


export { getPipeLineData }
