import { chunkTopicsIntoSize } from "../../modules/live-tracking.js"

describe('tests for live tracking module', () => {

    it('array reduce should return 0 entries' , () => {
        const channels = []
        const result = chunkTopicsIntoSize(channels)
        const expectedSize = 0

        expect(result).toHaveSize(expectedSize)
    })

    it('array reduce should return 0 entries' , () => {
        const channels = [{id: 1, name: 'user1'}]
        const expectedResult = [[{id: 1, name: 'user1'}]]

        const result = chunkTopicsIntoSize(channels)

        expect(result).toEqual(expectedResult)
    })
    it('array reduce should return 0 entries' , () => {
        const channels = [{id: 1, name: 'user1'}, {id: 2, name: 'user2'}, {id: 3, name: 'user3'} ]
        const expectedLength = 1

        const result = chunkTopicsIntoSize(channels)

        expect(result).toHaveSize(expectedLength)
    })
    it('array reduce should return 0 entries' , () => {
        let maxArraySize = 1
        const channels = [{id: 1, name: 'user1'}, {id: 2, name: 'user2'}, {id: 3, name: 'user3'} ]
        const expectedLength = 3

        const result = chunkTopicsIntoSize(channels, maxArraySize)

        expect(result).toHaveSize(expectedLength)
    })
})