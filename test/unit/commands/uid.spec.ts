import { UidCommand } from "../../../src/commands/cmd/uid.js"
import { setup } from "../../test-utils/setup.js"

describe('test uid command', () => {
    const uid = new UidCommand()

    beforeAll(() => {
        setup()
    })

    it('no user is given return usernames id', () => {

    })
})