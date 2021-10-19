import {connect, connection, set} from "mongoose";
import {dbConnection} from "./DBConfig";
import ErrorBase from "../middleware/error/ErrorBase";
import ErrorMessages from "../middleware/error/ErrorMessages";
import ErrorCodes from "../middleware/error/ErrorCodes";
import {StatusCodes} from "http-status-codes";
import Logger from "../middleware/Logger";

const LOG = new Logger('DBConnection.ts');


export const setUpDBConnection = () => {
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
