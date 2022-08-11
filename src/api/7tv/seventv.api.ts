import { Resource, ResourceError, ResourceSuccess } from "../types"
import { SevenTvGQL } from '@api/7tv/seventv.gql'
import { SevenTvRest } from '@api/7tv/seventv.rest'

export class SevenTvApi {
  gql: SevenTvGQL = new SevenTvGQL()
  rest: SevenTvRest = new SevenTvRest()

  async getEmotesForChannel(channel: string): Promise<Resource<string[]>> {
    return this.rest.getEmotesForChannel(channel)
  }

  async isEditor(
    username: string,
    channel: string
  ): Promise<Resource<boolean>> {
    if (username === channel) {
      return new ResourceSuccess(true)
    }
    const editors = await this.gql.getUserEditors(channel)

    if (editors instanceof ResourceError) {
      return editors
    }
    return new ResourceSuccess(
      editors.data.some(editor => editor.login === username.toLowerCase())
    )
  }
}

