import { BotResponse } from "../../client/response.js";
import { Command } from "../../commands/export/command.js";

export const exampleCommand = new Command({
    name: 'example',
    cooldown: 1000,
    description: 'example',
    execute: async () => new BotResponse('', '', true),
    optionalParams: [],
    requiredParams: [],
    permissions: 5,
})