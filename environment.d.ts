import { TwitchBot } from "./client/bot.js"

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'dev' | 'prod' | 'test'
			CLIENT_ID: string
			CLIENT_SECRET: string
			BEARERTOKEN_STREAMELEMENTS: string
			TWITCH_OAUTH: string
			GITHUB_TOKEN: string
			GITHUB_ENDPOINT_HELLTFBOT_V2: string
			GITHUB_ENDPOINT_INST_MONO: string
			GITHUB_ENDPOINT_GO_DISCORD_BOT: string
			PREFIX: string
			DB_PORT: string
			DB_HOST: string
			DB_USERNAME: string
			DB_PASSWORD: string
			DB_DATABASE: string
			MAIN_USER: string
			DEBUG: 'false'|'true'
		}
	}
}
declare global {
	var hb: TwitchBot;
  }
export {}
