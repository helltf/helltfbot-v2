import * as tmi from 'tmi.js'

import {getTrackClientConfig } from '../config/config'



const create = () => {
    let options = getTrackClientConfig()
    return tmi.Client({
        
    })

}