import DatabaseModel from "../models/DatabaseModel";

let DATABASE_URL: string | undefined;
({DATABASE_URL} = process.env);

/**
 * Database Configurations
 */
export const dbConnection:DatabaseModel = {
  url: DATABASE_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};

