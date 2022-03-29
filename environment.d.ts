
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
		}
	}
}


export {}
