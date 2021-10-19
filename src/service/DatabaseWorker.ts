import {parentPort} from 'worker_threads';
import {STATUS_DB_CONNECT, STATUS_DB_SAVE, STATUS_RETRY_SERVICE, STATUS_START_SERVICE} from "../utils/AppConstants";
import Logger from "../utils/Logger";
import { setUpDBConnection } from '../repository/DBConnection'
import {RaceEventModel} from '../models/RaceDataEvent';
import {IRaceEvent} from "../models/RaceEventResponseModel";

const LOG = new Logger('DatabaseWorker.js');

/**
 * If status is DB connect Initialize the DB connect
 * If Status is DB save Save the data
 */
parentPort.on('message', message => {
    const { status, data } = message;

    if (status === STATUS_DB_CONNECT){
        LOG.info("Going to connect to the database");
        setUpDBConnection();
        LOG.info("Going to publish message to trigger data fetch");
        parentPort.postMessage({ status: STATUS_START_SERVICE });
    }

    if (status === STATUS_DB_SAVE){
        LOG.info("Going to connect to save data");
        saveData(data);
    }
});


/**
 *
 * @param data
 */
const saveData = async(data: IRaceEvent) => {
    LOG.debug(`Saving Event: ${data}`);
    const raceEvent = new RaceEventModel(data)
    await raceEvent.save()
    LOG.debug(`call API upon successful Save`);
    parentPort.postMessage({ status: STATUS_RETRY_SERVICE });
}
