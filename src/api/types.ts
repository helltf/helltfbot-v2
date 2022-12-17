import { Emote } from "../commands/cmd/emotegame";

export type Resource<T> = ResourceError | ResourceSuccess<T>

export class ResourceSuccess<T> {
  data: T
  constructor(data: T) {
    this.data = data
  }

  unwrap(): T {
    return this.data
  }
}

export class ResourceError {
  error: string
  constructor(error: string) {
    this.error = error
  }
}

export declare interface EmoteApi {
  getEmotesForChannel: (channel: string) => Promise<Resource<Emote[]>>
}

export interface EmoteInfo {
  bttv: Emote[]
  ffz: Emote[]
  seventv: Emote[]
}
