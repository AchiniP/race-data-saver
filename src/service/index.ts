import {Worker} from 'worker_threads';
import path from 'path';
import {STATUS_DB_CONNECT, STATUS_DB_SAVE, STATUS_RETRY_SERVICE, STATUS_START_SERVICE} from "../utils/AppConstants";
import Logger from "../utils/Logger";
import {WorkerMessage} from "../models/WorkerMessage";
import ErrorBase from "../utils/error/ErrorBase";
import ErrorMessages from "../utils/error/ErrorMessages";
import ErrorCodes from "../utils/error/ErrorCodes";
import {StatusCodes} from "http-status-codes";
import FileUtil from "../utils/fileResolver";

const LOG = new Logger('InitService.js');

/**
 * Initialize worker threads
 * @returns {Promise<void>}
 */
const initWorkers = async () => {

  const workerConfigFile = FileUtil.fileResolver('WorkerServiceConfig.ts');
  const dbWorkerFile = FileUtil.fileResolver('DatabaseWorker.ts');
  const apiWorkerFile = FileUtil.fileResolver('APIWorker.ts');

  const dbWorker = new Worker(path.resolve(__dirname, workerConfigFile), {
    workerData: {
      path: path.resolve(__dirname, dbWorkerFile)
    }
  });

  const apiWorker = new Worker(path.resolve(__dirname, workerConfigFile), {
    workerData: {
      path: path.resolve(__dirname, apiWorkerFile)
    }
  });

  LOG.info('Publishing message to connect to DB');
  dbWorker.postMessage({status: STATUS_DB_CONNECT});

  handleDBWorker(dbWorker, apiWorker);
  handleAPIWorker(apiWorker, dbWorker);
  handleDBWorkerErrors(dbWorker);
  handleAPIWorkerErrors(apiWorker);
}

/*
 * DB worker Listeners
 * @param dbWorker
 * @param apiWorker
 */
const handleDBWorker = (dbWorker: Worker, apiWorker: Worker) => {

  dbWorker.on('message', (message: WorkerMessage) => {
    const {status, data} = message

    if (status === STATUS_RETRY_SERVICE || status === STATUS_START_SERVICE) {
      LOG.debug('Publishing message to fetch data');
      apiWorker.postMessage({status: STATUS_RETRY_SERVICE})
    }

    if (status === STATUS_DB_SAVE) {
      LOG.debug('Publishing message to save data');
      dbWorker.postMessage({status: STATUS_DB_SAVE, data: data})
    }
  });
}

/**
 * Handle Database worker errors
 * @param dbWorker
 */
const handleDBWorkerErrors = (dbWorker: Worker) => {
  dbWorker.on('error', code => {
    LOG.error(`Error occurred in Database worker. code: ${code}`);
    return new ErrorBase(ErrorMessages.DB_WORKER_ERROR, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });
  dbWorker.on('exit', code => {
    LOG.warn(`Going to Exiting Database worker. code: ${code}`);
    throw new ErrorBase(ErrorMessages.DB_WORKER_EXIT, ErrorCodes.RUNTIME_ERROR_CODE,
      StatusCodes.INTERNAL_SERVER_ERROR)
  });
}

/*
 * API worker Listeners
 * @param apiWorker
 * @param dbWorker
 */
const handleAPIWorker = (apiWorker: Worker, dbWorker: Worker) => {
  apiWorker.on('message', (message: WorkerMessage) => {
    const {status, data} = message

    if (status === STATUS_RETRY_SERVICE || status === STATUS_START_SERVICE) {
      LOG.debug('Publishing message to fetch data');
      apiWorker.postMessage({status: STATUS_RETRY_SERVICE})
    }

    if (status === STATUS_DB_SAVE) {
      LOG.debug('Publishing message to save data');
      dbWorker.postMessage({status: STATUS_DB_SAVE, data: data})
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

