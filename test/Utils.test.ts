import ErrorBase from '../src/utils/error/ErrorBase';
import ErrorMessages from '../src/utils/error/ErrorMessages';
import ErrorCodes from '../src/utils/error/ErrorCodes';
import FileUtil from "../src/utils/FileResolver";

/**
 * Error Base test
 */
describe('ErrorBase', () => {
  const Error = new ErrorBase(ErrorMessages.API_WORKER_ERROR, ErrorCodes.RUNTIME_ERROR_CODE, 500);

  test('getErrorCode', () => {
    expect(Error.getErrorCode()).toBe(ErrorCodes.RUNTIME_ERROR_CODE);
  });

  test('getHttpStatusCode', () => {
    expect(Error.getHttpStatusCode()).toBe(500);
  });

  test('getMessage', () => {
    expect(Error.getMessage()).toBe(ErrorMessages.API_WORKER_ERROR);
  });
});

/**
 * FileResolver test
 */
describe("FileUtil", () => {

  const OLD_CONFIG = process[Symbol.for('ts-node.register.instance')]

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process[Symbol.for('ts-node.register.instance')] = { ... OLD_CONFIG}
  });

  afterAll(() => {
    process[Symbol.for('ts-node.register.instance')] = OLD_CONFIG // Restore old environment
  });

  test('should not convert to file extension to js when running in type script', () => {
    expect(FileUtil.fileResolver("test.ts")).toBe("test.ts");
  });

  test('should convert to file extension to js when running in js', () => {
    process[Symbol.for('ts-node.register.instance')] = null;
    expect(FileUtil.fileResolver("test.ts")).toBe("test.js");
  });
})
