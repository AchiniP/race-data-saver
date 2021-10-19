import 'dotenv/config';
import { closetDBConnection } from './repository/DBConnection';
import Logger from './utils/Logger';
const LOG = new Logger('index.js');
import Service from './service'


/**
 * Entry point
 * @returns {Promise<void>}
 */
const runWorker = async () => {
  LOG.info("Started the scheduler...");
  Service.runService().catch(err => console.error(err));
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

