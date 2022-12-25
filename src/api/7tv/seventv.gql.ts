import { Resource, ResourceSuccess, ResourceError } from "@api/types"
import request from 'graphql-request'
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

  async addEmote(emote: string, channel: string): Promise<Resource<EmoteData>> {
    const channelId = await hb.api.seventv.rest.getUserId(channel)

    if (channelId instanceof ResourceError) return channelId

    const emoteResource = await this.matchQueriedEmotes(emote)

    if (emoteResource instanceof ResourceError) {
      return emoteResource
    }

    return this.addEmoteById(emoteResource.data.id, channelId.data)
  }

  async matchQueriedEmotes(emote: string): Promise<Resource<EmoteData>> {
    const queriedEmotes = await this.queryEmotes(emote)

    if (queriedEmotes instanceof ResourceError) {
      return queriedEmotes
    }

    const match = this.findMatch(queriedEmotes.data, emote)

    if (!match) return new ResourceError('no matching emote found')

    return new ResourceSuccess(match)
  }

  async queryEmotes(emote: string): Promise<Resource<SearchEmote[]>> {
    const query = this.getQueryEmoteQuery()
    const response = await this.runGqlRequest<EmoteQueryData>(
      query,
      this.getQuerySettings(emote)
    )

    if (response instanceof ResourceError) {
      return new ResourceError('No emote found')
    }

    return new ResourceSuccess(response.data.search_emotes)
  }

  async removeEmoteById(
    emoteId: string,
    channelId: string
  ): Promise<Resource<EmoteData>> {
    const query = this.getRemoveEmoteQuery()
    const variables = this.getEmoteUpdateVariables(emoteId, channelId, '')

    const response = await this.runGqlRequest<RemoveEmoteResponse>(
      query,
      variables
    )

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    const removeEmote = response.data.removeChannelEmote.emotes?.find(
      ({ id }) => {
        return id === emoteId
      }
    )

    return new ResourceSuccess({ id: emoteId, name: removeEmote!.name })
  }

  async removeEmote(
    emote: string,
    channel: string
  ): Promise<Resource<EmoteData>> {
    const channelId = await hb.api.seventv.rest.getUserId(channel)

    if (channelId instanceof ResourceError) return channelId

    const emoteResource = await hb.api.seventv.rest.getEmoteIdAndName(
      emote,
      channel
    )

    if (emoteResource instanceof ResourceError) {
      return emoteResource
    }

    return await this.removeEmoteById(emoteResource.data.id, channelId.data)
  }

  async yoink(
    emote: string,
    channel: string,
    newChannel: string
  ): Promise<Resource<EmoteData>> {
    const channelId = await hb.api.seventv.rest.getUserId(newChannel)

    if (channelId instanceof ResourceError) return channelId

    const emoteResource = await hb.api.seventv.rest.getEmoteIdAndName(
      emote,
      channel
    )

    if (emoteResource instanceof ResourceError) {
      return emoteResource
    }

    const { id: emoteId } = emoteResource.data

    if (!emoteId) return new ResourceError('Could not find that emote')

    return this.addEmoteById(emoteResource.data.id, channelId.data)
  }

  async addEmoteById(
    emoteId: string,
    channelId: string
  ): Promise<Resource<EmoteData>> {
    const query = this.getAddEmoteQuery()
    const variables = this.getEmoteUpdateVariables(emoteId, channelId, '')

    const response = await this.runGqlRequest<AddEmoteResponse>(
      query,
      variables
    )

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    const addedEmote = response.data.addChannelEmote.emotes?.find(({ id }) => {
      return id === emoteId
    })

    return new ResourceSuccess({ id: emoteId, name: addedEmote!.name })
  }

  async setAliasByEmoteId(
    emoteId: string,
    emoteName: string,
    channelId: string
  ): Promise<Resource<string>> {
    const query = this.getEditEmoteQuery()
    const variables = this.getEmoteUpdateVariablesWithData(
      emoteId,
      channelId,
      '',
      { alias: emoteName }
    )

    const response = await this.runGqlRequest<AliasResponse>(query, variables)

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    return new ResourceSuccess(response.data.editChannelEmote.id)
  }

  async setAlias(
    emoteId: string,
    emoteName: string,
    channel: string
  ): Promise<Resource<string>> {
    const channelId = await hb.api.seventv.rest.getUserId(channel)

    if (channelId instanceof ResourceError) return channelId

    return this.setAliasByEmoteId(emoteId, emoteName, channelId.data)
  }

  async getUserEditorsByUserId(userId: string): Promise<Resource<Editor[]>> {
    const query = this.getUserEditorsQuery()
    const variables = this.getUserEditorsVariables(userId)

    const response = await this.runGqlRequest<SevenTvUserResponse>(
      query,
      variables
    )

    if (response instanceof ResourceError) {
      return this.getErrorMessage(response.error)
    }

    return new ResourceSuccess(response.data.user.editors)
  }

  async getUserEditors(username: string): Promise<Resource<Editor[]>> {
    const userId = await hb.api.seventv.rest.getUserId(username)

    if (userId instanceof ResourceError) {
      return userId
    }
    return this.getUserEditorsByUserId(userId.data)
  }

  private getAddEmoteQuery(): string {
    return `mutation AddChannelEmote($ch: String!, $em: String!, $re: String!) {addChannelEmote(channel_id: $ch, emote_id: $em, reason: $re) {emotes{id, name}}}`
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

  getEmoteUpdateVariables(emoteId: string, channelId: string, re: string) {
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
    return `mutation EditChannelEmote($ch: String!, $em: String!, $data: ChannelEmoteInput!, $re: String) {editChannelEmote(channel_id: $ch, emote_id: $em, data: $data, reason: $re) {id}}`
  }

  private findMatch(
    emotes: SearchEmote[],
    emoteName: string
  ): EmoteData | undefined {
    for (const { id, name } of emotes) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const resultDistance = distance(emoteName, name, {
        caseSensitive: false
      })
      if (resultDistance === 1) {
        return { id, name }
      }
    }
  }
}

export interface AliasResponse {
  editChannelEmote: {
    id: string
  }
}

export interface AddEmoteResponse {
  addChannelEmote: Partial<User>
}

export interface RemoveEmoteResponse {
  removeChannelEmote: Partial<User>
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
  emotes: EmoteData[]
}

export interface SevenTvUserResponse {
  user: User
}

export interface EmoteData {
  id: string
  name: string
}
