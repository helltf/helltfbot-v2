import { Resource } from "../types"
import { SevenTvGQL } from '@api/7tv/seventv.gql'
import { SevenTvRest } from '@api/7tv/seventv.rest'

export class SevenTvApi {
  gql: SevenTvGQL = new SevenTvGQL()
  rest: SevenTvRest = new SevenTvRest()

  async getEmotesForChannel(channel: string): Promise<Resource<string[]>> {
    return this.rest.getEmotesForChannel(channel)
  }
}

