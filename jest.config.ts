import type { Config } from "@jest/types";
import { TwitchBot } from "./bot";

export default async (): Promise<Config.InitialOptions> => {
  return {
    globals: {
      hb: true
    },

    transform: {
      '^.+\\.ts?$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.json'
        }
      ]
    },
    preset: 'ts-jest',
    displayName: {
      name: 'helltfbot-v2',
      color: 'greenBright'
    },
    detectLeaks: true,
    verbose: true,
    setupFiles: ['dotenv/config'],
    testMatch: ['**/**/*.spec.ts'],
    testEnvironment: 'node',
    detectOpenHandles: true,
    coveragePathIgnorePatterns: ['test/test-utils', 'src/db/migration'],
    modulePaths: ['<rootDir>'],
    forceExit: true,
    clearMocks: true,
    testTimeout: 15000
  }
}
