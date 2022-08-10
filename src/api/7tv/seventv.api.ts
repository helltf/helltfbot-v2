import { Emote } from "../../commands/cmd/emotegame"
import { Resource, ResourceError, ResourceSuccess } from "../types"
import fetch from "node-fetch"
import { request } from 'graphql-request'
import distance from 'jaro-winkler'

export class SevenTvApi {
  url = 'https://api.7tv.app/v2/users/'
  gql_url = 'https://7tv.io/v2/gql'

  async fetchEmotes(channel: string): Promise<Resource<Emote[]>> {
    const emotes = await this.fetchEmotesWithData(channel)

    if (emotes instanceof ResourceError) return emotes
    return new ResourceSuccess(emotes.data.map(emote => emote.name))
  }

  async fetchEmotesWithData(
    channel: string
  ): Promise<Resource<SeventvEmoteResponse[]>> {
    const error = new ResourceError('Error fetching 7tv emotes')

    try {
      const emotes = (await (
        await fetch(this.url + channel + '/emotes')
      ).json()) as SeventvEmoteResponse[]
      return new ResourceSuccess(emotes)
    } catch (e) {
      return error
    }
  }

  async getEmotesForChannel(channel: string): Promise<Resource<Emote[]>> {
    return await this.fetchEmotes(channel)
  }

  async getUserId(username: string) {
    try {
      const user = (await (
        await fetch(this.url + username)
      ).json()) as SevenTvUserResponse
      return new ResourceSuccess(user.id)
    } catch (e) {
      return new ResourceError('Error fetching user')
    }
  }

  private getAddEmoteQuery(): string {
    return `mutation AddChannelEmote($ch: String!, $em: String!, $re: String!) {addChannelEmote(channel_id: $ch, emote_id: $em, reason: $re) {emote_ids}}`
  }

  private getRemoveEmoteQuery(): string {
    return `mutation RemoveChannelEmote($ch: String!, $em: String!, $re: String!) {removeChannelEmote(channel_id: $ch, emote_id: $em, reason: $re) {emote_ids}}`
  }

  private getEmoteUpdateVariables(
    emoteId: string,
    channelId: string,
    re: string
  ) {
    return {
      em: emoteId,
      ch: channelId,
      re: re
    }
  }

  private getEmoteUpdateVariablesWithData(
    emoteId: string,
    channelId: string,
    re: string,
    data?: { [key: string]: string }
  ) {
    return {
      em: emoteId,
      ch: channelId,
      re: re,
      data: data
    }
  }

  private getQueryEmoteQuery() {
    return `query($query: String!,$page: Int,$pageSize: Int,$globalState: String,$sortBy: String,$sortOrder: Int,$channel: String,$submitted_by: String,$filter: EmoteFilter) {search_emotes(query: $query,limit: $pageSize,page: $page,pageSize: $pageSize,globalState: $globalState,sortBy: $sortBy,sortOrder: $sortOrder,channel: $channel,submitted_by: $submitted_by,filter: $filter) {id,visibility,urls,owner {id,display_name,role {id,name,color},banned}urls,name,tags}}`
  }

  private getGqlAuthorization() {
    return {
      authorization: 'Bearer ' + process.env.SEVENTV_GQL_TOKEN
    }
  }

  private getQuerySettings(emote: string) {
    return {
      query: emote,
      page: 1,
      pageSize: 100,
      limit: 100,
      globalState: null,
      sortBy: 'popularity',
      sortOrder: 0,
      channel: null,
      submitted_by: null
    }
  }

  async addEmote(emote: string, channel: string): Promise<Resource<string>> {
    const channelId = await this.getUserId(channel)

    if (channelId instanceof ResourceError) return channelId

    const emoteResource = await this.queryEmotes(emote)

    if (emoteResource instanceof ResourceError) {
      return emoteResource
    }

    const [emoteId, emoteName] = emoteResource.data

    const query = this.getAddEmoteQuery()
    const variables = this.getEmoteUpdateVariables(emoteId, channelId.data, '')

    const response = await this.runGqlRequest(query, variables)

    if (response instanceof ResourceError) {
      return new ResourceError(
        'Could not add emote. You may forgot to add me as an editor of your channel :) '
      )
    }

    return new ResourceSuccess(emoteName)
  }

  private async runGqlRequest<T>(
    query: string,
    variables: { [key: string]: any }
  ): Promise<Resource<T>> {
    try {
      const response = (await request(
        this.gql_url,
        query,
        variables,
        this.getGqlAuthorization()
      )) as T
      return new ResourceSuccess(response)
    } catch (e: any) {
      const gqlError: SeventvErrorResponse = JSON.parse(
        JSON.stringify(e, undefined, 2)
      ) as SeventvErrorResponse
      return new ResourceError(
        String(gqlError.response?.errors[0]?.extensions.code)
      )
    }
  }

  async queryEmotes(emote: string): Promise<Resource<string[]>> {
    const query = this.getQueryEmoteQuery()

    const response = (await request(
      this.gql_url,
      query,
      this.getQuerySettings(emote),
      this.getGqlAuthorization()
    )) as EmoteQueryData

    for (const foundEmote of response.search_emotes) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const resultDistance = distance(emote, foundEmote.name, {
        caseSensitive: false
      })
      if (resultDistance === 1) {
        return new ResourceSuccess([foundEmote.id, foundEmote.name])
      }
    }
    return new ResourceError('no matching emote found')
  }

  async getEmoteIdAndName(
    givenEmote: string,
    channel: string
  ): Promise<Resource<string[]>> {
    const emotes = await this.fetchEmotesWithData(channel)
    if (emotes instanceof ResourceError)
      return new ResourceError('Could not fetch emotes')

    const emote = emotes.data.find(e => e.name === givenEmote)

    return !emote
      ? new ResourceError('emote not found')
      : new ResourceSuccess([emote.id, emote.name])
  }

  async removeEmote(emote: string, channel: string): Promise<Resource<string>> {
    const channelIdResponse = await this.getUserId(channel)

    if (channelIdResponse instanceof ResourceError) return channelIdResponse

    const channelId = channelIdResponse.data

    const emoteResource = await this.getEmoteIdAndName(emote, channel)
    if (emoteResource instanceof ResourceError) {
      return new ResourceError(emoteResource.error)
    }
    const [emoteId, emoteName] = emoteResource.data

    if (!emoteId) return new ResourceError('Could not find that emote')

    const query = this.getRemoveEmoteQuery()
    const variables = this.getEmoteUpdateVariables(emoteId, channelId, '')

    const response = await this.runGqlRequest(query, variables)

    if (response instanceof ResourceError) {
      return new ResourceError(
        'Could not add emote. You may forgot to add me as an editor of your channel :) '
      )
    }

    return new ResourceSuccess(emoteName)
  }

  async yoink(
    emote: string,
    channel: string,
    newChannel: string
  ): Promise<Resource<string[]>> {
    const channelId = await this.getUserId(newChannel)

    if (channelId instanceof ResourceError) return channelId

    const emoteResource = await this.getEmoteIdAndName(emote, channel)

    if (emoteResource instanceof ResourceError) {
      return emoteResource
    }

    const [emoteId, emoteName] = emoteResource.data

    if (!emoteId) return new ResourceError('Could not find that emote')

    const query = this.getAddEmoteQuery()
    const variables = this.getEmoteUpdateVariables(emoteId, channelId.data, '')

    const response = await this.runGqlRequest(query, variables)

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    return new ResourceSuccess([emoteId, emoteName])
  }

  private getErrorMessage(code?: string): ResourceError {
    if (code === '70403')
      return new ResourceError('Please add me as an editor of your channel :)')
    if (code === '704611') return new ResourceError('Emote is already enabled')

    return new ResourceError('Unknown Error')
  }

  async setAlias(
    emoteId: string,
    emoteName: string,
    yoinkChannel: string
  ): Promise<Resource<undefined>> {
    const channelId = await this.getUserId(yoinkChannel)

    if (channelId instanceof ResourceError) return channelId

    const query = this.getEditEmoteQuery()
    const variables = this.getEmoteUpdateVariablesWithData(
      emoteId,
      channelId.data,
      '',
      { alias: emoteName }
    )

    const response = await this.runGqlRequest(query, variables)

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    return new ResourceSuccess(undefined)
  }
  getEditEmoteQuery() {
    return `mutation EditChannelEmote($ch: String!, $em: String!, $data: ChannelEmoteInput!, $re: String) {editChannelEmote(channel_id: $ch, emote_id: $em, data: $data, reason: $re) {id,emote_aliases}}`
  }
}

interface SeventvEmoteResponse {
  id: string
  name: string
}

interface SevenTvUserResponse {
  id: string
  twitch_id: string
  login: string
  display_name: string
  role: {
    id: string
    name: string
    position: number
    color: number
    allowed: number
    denied: number
  }
  profile_picture_id: string
}

export interface Role {
  id: string
  name: string
  color: number
}

export interface Owner {
  id: string
  display_name: string
  role: Role
  banned: boolean
}

export interface SearchEmote {
  id: string
  visibility: number
  urls: string[][]
  owner: Owner
  name: string
  tags: string[]
}

export interface EmoteQueryData {
  search_emotes: SearchEmote[]
}

export interface Extensions {
  code: number
  message: string
}

export interface SeventvGqlError {
  message: string
  path: string[]
  extensions: Extensions
}

export interface SeventvErrorResponse {
  response: {
    errors: SeventvGqlError[]
  }
}


