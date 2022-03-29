import { getPipeLineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'

const getData = async () => {
    let {success, data, error} = await getPipeLineData(Projects.helltfbot_v2)
    
    if(!success) return

    console.log(data)
}

export {getData}