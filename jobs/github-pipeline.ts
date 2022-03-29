import { getPipeLineData } from '../api/github/github-api.js'
import { Projects } from '../api/github/github-projects.js'

const getData = async () => {
    let res = await getPipeLineData(Projects.helltfbot_v2)
    console.log(res)
}

export {getData}