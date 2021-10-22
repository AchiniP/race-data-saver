import DatabaseModel from "../models/DatabaseModel";
import Config from '../config/AppConfig';

/**
 * Database Configurations
 */
export const dbConnection:DatabaseModel = {
  url: Config.DATABASE_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};

