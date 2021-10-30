import 'dotenv/config';
import Logger from './utils/Logger';
import Service from './service'

const LOG = new Logger('index');

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
process.on('SIGINT', () => {
  LOG.info('SIGINT signal received. Exit App!');
  process.exit(1);
});

process.on('uncaughtException', err => {
  LOG.error(`Unexpected Error occurred in Application. Exit App! Error: ${err}`);
  process.exit(1)
})

runWorker();

