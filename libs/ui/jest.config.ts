import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "ui",
  preset: "../../jest.preset.ts",
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts", "@angular/localize/init"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.(html|svg)$",
    },
  },
  coverageDirectory: "../../coverage/libs/ui",
  transform: {
    "^.+\\.(ts|mjs|js|html)$": "jest-preset-angular",
  },
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
  snapshotSerializers: [
    "jest-preset-angular/build/serializers/no-ng-attributes",
    "jest-preset-angular/build/serializers/ng-snapshot",
    "jest-preset-angular/build/serializers/html-comment",
  ],
};

export default config;
