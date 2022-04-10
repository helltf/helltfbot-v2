import { hb } from "../helltfbot.js"

const update = () => {
    for(let [_, command] of hb.commands){
        hb.db.commandRepo.save({
            ...command
        })
    }
}


export {update as updateCommandsInDb}