import { Resource, ResourceError, ResourceSuccess } from "../types"
import { SevenTvGQL } from '@api/7tv/seventv.gql'
import { SevenTvRest } from '@api/7tv/seventv.rest'

export class SevenTvApi {
  gql: SevenTvGQL
  rest: SevenTvRest

  constructor() {
    this.rest = new SevenTvRest()
    this.gql = new SevenTvGQL(this.rest)
  }

  async getEmotesForChannel(channel: string): Promise<Resource<string[]>> {
    return this.rest.getEmotesForChannel(channel)
  }

  getIdFromUrl = (emoteUrl: string): string | undefined => {
    const match = emoteUrl.match(
      /(?<=(7tv\.app\/emotes\/))(\w*|\d*)(?=$|\/.*)/gim
    )

    return match ? match[0] : undefined
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
