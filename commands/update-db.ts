
const addNewCommands = () => {
    for(let [_, command] of hb.commands){
        hb.db.commandRepo.save({
            ...command
        })
    }
}

const update = () => {
    if(process.env.NODE_ENV !== 'prod') return
    addNewCommands()
    removeDeletedCommands()
}

async function removeDeletedCommands() {
    let commandNames = (await hb.db.commandRepo.find()).map(c => c.name)

    for(let name of commandNames){
        if(!hb.commands.get(name)){
            hb.db.commandRepo.delete({
                name: name
            })
        }
    }
}
export {update as updateCommandsInDb}