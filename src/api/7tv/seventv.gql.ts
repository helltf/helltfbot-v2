import { Resource, ResourceSuccess, ResourceError } from "@api/types"
import request from "graphql-request"
import distance from 'jaro-winkler'

export class SevenTvGQL {
  url = 'https://7tv.io/v2/gql'

  async runGqlRequest<T>(
    query: string,
    variables: { [key: string]: any }
  ): Promise<Resource<T>> {
    try {
      const response = (await request(
        this.url,
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

  async addEmote(emote: string, channel: string): Promise<Resource<string>> {
    const channelId = await hb.api.seventv.rest.getUserId(channel)

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
      return this.getErrorMessage(response.error)
    }

    return new ResourceSuccess(emoteName)
  }

  async queryEmotes(emote: string): Promise<Resource<string[]>> {
    const query = this.getQueryEmoteQuery()
    const response = await this.runGqlRequest<EmoteQueryData>(
      query,
      this.getQuerySettings(emote)
    )

    if (response instanceof ResourceError) {
      return new ResourceError('No emote found')
    }

    for (const foundEmote of response.data.search_emotes) {
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

  async removeEmote(emote: string, channel: string): Promise<Resource<string>> {
    const channelIdResponse = await hb.api.seventv.rest.getUserId(channel)

    if (channelIdResponse instanceof ResourceError) return channelIdResponse

    const channelId = channelIdResponse.data

    const emoteResource = await hb.api.seventv.rest.getEmoteIdAndName(
      emote,
      channel
    )
    if (emoteResource instanceof ResourceError) {
      return new ResourceError(emoteResource.error)
    }
    const [emoteId, emoteName] = emoteResource.data

    if (!emoteId) return new ResourceError('Could not find that emote')

    const query = this.getRemoveEmoteQuery()
    const variables = this.getEmoteUpdateVariables(emoteId, channelId, '')

    const response = await this.runGqlRequest(query, variables)

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    return new ResourceSuccess(emoteName)
  }

  async yoink(
    emote: string,
    channel: string,
    newChannel: string
  ): Promise<Resource<string[]>> {
    const channelId = await hb.api.seventv.rest.getUserId(newChannel)

    if (channelId instanceof ResourceError) return channelId

    const emoteResource = await hb.api.seventv.rest.getEmoteIdAndName(
      emote,
      channel
    )

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

  async setAlias(
    emoteId: string,
    emoteName: string,
    channel: string
  ): Promise<Resource<null>> {
    const channelId = await hb.api.seventv.rest.getUserId(channel)

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

    return new ResourceSuccess(null)
  }

  async getUserEditors(username: string): Promise<Resource<Editor[]>> {
    const userId = await hb.api.seventv.rest.getUserId(username)

    if (userId instanceof ResourceError) {
      return userId
    }

    const query = this.getUserEditorsQuery()
    const variables = this.getUserEditorsVariables(userId.data)

    const response = await this.runGqlRequest<SevenTvUserResponse>(
      query,
      variables
    )

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    return new ResourceSuccess(response.data.user.editors)
  }

  private getAddEmoteQuery(): string {
    return `mutation AddChannelEmote($ch: String!, $em: String!, $re: String!) {addChannelEmote(channel_id: $ch, emote_id: $em, reason: $re) {emote_ids}}`
  }

  private getRemoveEmoteQuery(): string {
    return `mutation RemoveChannelEmote($ch: String!, $em: String!, $re: String!) {removeChannelEmote(channel_id: $ch, emote_id: $em, reason: $re) {emote_ids}}`
  }

  getErrorMessage(code?: string): ResourceError {
    if (code === '70403')
      return new ResourceError('Please add me as an editor of your channel :)')
    if (code === '704611') return new ResourceError('Emote is already enabled')
    if (code === '704610') return new ResourceError('Emote is not enabled')
    if (code === '704612')
      return new ResourceError('Emote with this name already exists')
    if (code === '704620') return new ResourceError('No slot available')
    return new ResourceError('Unknown Error')
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

  private getUserEditorsQuery() {
    return `query GetUser($id: String!) {user(id: $id) {...FullUser}}fragment FullUser on User {id,email, display_name, login,description,editor_ids,editors {id, display_name, login}}`
  }

  private getUserEditorsVariables(id: string) {
    return {
      id: id
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

  private getEditEmoteQuery() {
    return `mutation EditChannelEmote($ch: String!, $em: String!, $data: ChannelEmoteInput!, $re: String) {editChannelEmote(channel_id: $ch, emote_id: $em, data: $data, reason: $re) {id,emote_aliases}}`
  }
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

export interface Editor {
  id: string
  display_name: string
  login: string
}

export interface User {
  id: string
  email?: any
  display_name: string
  login: string
  description: string
  editor_ids: string[]
  editors: Editor[]
}

export interface SevenTvUserResponse {
  user: User
}