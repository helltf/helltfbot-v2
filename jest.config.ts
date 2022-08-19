import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import {compilerOptions} from './tsconfig.json'


export default async (): Promise<Config.InitialOptions> => {
  return {
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      },
      hb: true
    },

    transform: {
      '^.+\\.ts?$': 'ts-jest'
    },
    preset: 'ts-jest',
    displayName: {
      name: 'helltfbot-v2',
      color: 'greenBright'
    },
    verbose: true,
    setupFiles: ['dotenv/config'],
    testMatch: ['**/**/*.spec.ts'],
    testEnvironment: 'node',
    detectOpenHandles: true,
    coveragePathIgnorePatterns: ['test/test-utils', 'src/db/migration '],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    modulePaths: ['<rootDir>'],
    forceExit: true,
    clearMocks: true,
    testTimeout: 15000
  }
}