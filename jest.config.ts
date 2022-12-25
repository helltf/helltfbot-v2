import type { Config } from "@jest/types";
import { TwitchBot } from "./bot";
import { pathsToModuleNameMapper } from "ts-jest";
import {compilerOptions} from './tsconfig.json'

export default async (): Promise<Config.InitialOptions> => {
  return {
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
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    modulePaths: ['<rootDir>'],
    forceExit: true,
    restoreMocks: true,
    testTimeout: 15000
  }
}
