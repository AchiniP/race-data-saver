import {Worker} from 'worker_threads';
import path from 'path';
import {STATUS_DB_CONNECT, STATUS_RETRY_SERVICE, STATUS_START_SERVICE} from "../utils/AppConstants";
import Logger from '../utils/Logger';
import {WorkerMessage} from '../models/WorkerMessage';
import ErrorBase from '../utils/error/ErrorBase';
import ErrorMessages from '../utils/error/ErrorMessages';
import ErrorCodes from '../utils/error/ErrorCodes';
import {StatusCodes} from 'http-status-codes';
import FileUtil from "../utils/FileResolver";

const LOG = new Logger('Service');

/**
 * Initialize worker threads
 * @returns {Promise<void>}
 */
const initWorkers = async () => {

  const workerConfigFile = FileUtil.fileResolver('WorkerServiceConfig.ts');
  const apiWorkerFile = FileUtil.fileResolver('AppWorker.ts');

  const apiWorker = new Worker(path.resolve(__dirname, workerConfigFile), {
    workerData: {
      path: path.resolve(__dirname, apiWorkerFile)
    }
  });

  LOG.info('Publishing message to connect to DB');
  apiWorker.postMessage({status: STATUS_DB_CONNECT});

  handleAPIWorker(apiWorker);
  handleAPIWorkerErrors(apiWorker);
}

/*
 * API worker Listeners
 * @param apiWorker
 */
const handleAPIWorker = (apiWorker: Worker) => {
  apiWorker.on('message', (message: WorkerMessage) => {
    const {status} = message

    if (status === STATUS_RETRY_SERVICE || status === STATUS_START_SERVICE) {
      LOG.debug('Publishing message to fetch data');
      apiWorker.postMessage({status: STATUS_RETRY_SERVICE})
    }

  });
}

/**
 * Handle API worker errors
 * @param apiWorker
 */
const handleAPIWorkerErrors = (apiWorker: Worker) => {
  apiWorker.on('error', code => {
    LOG.error(`Error occurred in API worker. code: ${code}`);
    apiWorker.terminate();
    return new ErrorBase(ErrorMessages.API_WORKER_ERROR, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });
  apiWorker.on('exit', code => {
    LOG.warn(`Going to Exiting API worker. code: ${code}`);
    throw new ErrorBase(ErrorMessages.API_WORKER_EXIT, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });
}
/**
 * Initialize workers
 * @returns {Promise<void>}
 */
const runService = async (): Promise<void> => {
  await initWorkers();
}

export default {
  runService
}

