module.exports = {
  testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  coveragePathIgnorePatterns: ['./src/config/*', './src/service/AppWorker.ts',
    './src/index.ts', './src/service/WorkerServiceConfig.ts', './src/utils/Logger.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
  setupFilesAfterEnv: [
    './test/testdb.ts'
  ],
};
