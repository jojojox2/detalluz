import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "detalluz-lambda",
  preset: "../../jest.preset.ts",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/apps/detalluz-lambda",
};

export default config;
