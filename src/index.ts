import 'dotenv/config';
import { setUpDBConnection, closetDBConnection } from './repository/DBConnection';
import Logger from './utils/Logger';
const LOG = new Logger('index.js');
import RaceAPIService from './service/RaceAPIService'


/**
 * Entry point
 * @returns {Promise<void>}
 */
const runWorker = async () => {
  LOG.info("Started the scheduler...");
  setUpDBConnection();
  await RaceAPIService.fetchRaceData();
}

/**
 * Gracefully handle SIGINT
 */
process.on('SIGINT',  () => {
  LOG.info('SIGTERM signal received.');
  LOG.warn('Closing http server.');
  closetDBConnection(() => {
    LOG.info('MongoDb connection closed.');
    process.exit(0);
  });
});

runWorker();

