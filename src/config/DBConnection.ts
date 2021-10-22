import {connect, connection, set} from 'mongoose';
import {StatusCodes} from 'http-status-codes';
import {dbConnection} from './DBConfig';
import ErrorBase from '../utils/error/ErrorBase';
import ErrorMessages from '../utils/error/ErrorMessages';
import ErrorCodes from '../utils/error/ErrorCodes';
import Logger from '../utils/Logger';

const LOG = new Logger('DBConnection');
let ENV: string | undefined;
// eslint-disable-next-line prefer-const
({ENV} = process.env);

/**
 * Set Up Database Connection
 */
const setUpDBConnection = ():void => {
  if (ENV !== 'production') {
    set('debug', true);
  }
  connect(dbConnection.url, dbConnection.options);
  const db = connection;
  db.on("error", error => {
    LOG.error(error);
    throw new ErrorBase(ErrorMessages.DB_CONNECTION_ERROR, ErrorCodes.DB_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  });
  db.once("open", () => LOG.info("connected to database..."));
}

export default {
  setUpDBConnection,
}
