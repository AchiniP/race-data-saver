import {parentPort} from 'worker_threads';
import {StatusCodes} from 'http-status-codes';
import RaceEventService from './RaceAPIService';
import {STATUS_START_SERVICE, STATUS_RETRY_SERVICE, STATUS_DB_CONNECT} from "../utils/AppConstants";
import Logger from "../utils/Logger";
import {ErrorResponse} from "../models/Error.Model";
import {IRaceEvent, RaceEventResponse} from "../models/RaceEventResponseModel";
import {WorkerMessage} from "../models/WorkerMessage";
import DBConnection from "../config/DBConnection";
import {RaceEventModel} from "../models/RaceDataEvent";

const LOG = new Logger('AppWorker');

/**
 * Subscribe to messages from Parent
 */
parentPort.on("message", (message: WorkerMessage) => {
    const {status} = message;

  if (status === STATUS_DB_CONNECT) {
    LOG.info('Going to connect to the database');
    DBConnection.setUpDBConnection();
    LOG.info('Going to start data service');
    parentPort.postMessage({status: STATUS_START_SERVICE});
  }

    if (status === STATUS_START_SERVICE || status === STATUS_RETRY_SERVICE) {
      getRaceData()
    }
})

/**
 * fetch race event data through worker
 * @returns {Promise<void>}
 */
const getRaceData = async () => {
    LOG.info('running API worker')
    await RaceEventService.fetchRaceData().then(
        resonse => handleResponse(resonse)
    ).catch(err => handleError(err));
}

/**
 * handler for success response from result api
 * @param response
 * @returns {Promise<void>}
 */
const handleResponse = async (response: RaceEventResponse) => {
    if (response.status === StatusCodes.OK) {
        LOG.info('Publishing for Save RaceEvent');
        const {data} = await response
        await saveData(data);
    } else {
      LOG.info(`Response Status Received is ${response.status}. Publishing for retry`);
      parentPort.postMessage({status: STATUS_RETRY_SERVICE})
    }
}

/**es
 * handler for error response
 * @param error
 * @returns {Promise<void>}
 */
const handleError = async (error: ErrorResponse) => {
    LOG.error(`Error occurred when fetching results: ${error}`);
    if (error.response && error.response.status === StatusCodes.UNAUTHORIZED) {
        await RaceEventService.fetchAuthToken();
    }
    LOG.info('Publishing for retry on error');
    parentPort.postMessage({status: STATUS_RETRY_SERVICE});
}

/**
 * Save Data to DB
 * @param data
 * @returns {Promise<void>}
 */
const saveData = async(data: IRaceEvent) => {
  LOG.debug(`Saving Event: ${data}`);
  const raceEvent = new RaceEventModel(data)
  await raceEvent.save()
  LOG.debug(`call API upon successful Save`);
  parentPort.postMessage({ status: STATUS_RETRY_SERVICE });
}
