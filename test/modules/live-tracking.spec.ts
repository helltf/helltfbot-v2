import { chunkTopicsInto50 } from "../../modules/live-tracking.js"

describe('tests for live tracking module', () => {

    it('array reduce should return 0 entries' , () => {
        const channels = new Map()
        const result = chunkTopicsInto50(channels)
        const expectedSize = 0

        expect(result).toHaveSize(expectedSize)
    })

    it('array reduce should return 0 entries' , () => {
        const channels = new Map([[1,'user1']])

        const result = chunkTopicsInto50(channels)
    })
})