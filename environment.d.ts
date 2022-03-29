
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'dev' | 'prod'
			DATABASE_URL: string
			CLIENT_ID: string
			CLIENT_SECRET: string
			BEARERTOKEN_STREAMELEMENTS: string
			TWITCH_OAUTH: string
      GITHUB_TOKEN: string
      GITHUB_ENDPOINT_HELLTFBOT_V2: string
      GITHUB_ENDPOINT_INST_MONO: string
      GITHUB_ENDPOINT_GO_DISCORD_BOT: string
		}
	}
}


export {}
