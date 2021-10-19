import 'dotenv/config';
import { connect, set, connection } from 'mongoose';
const {DATABASE_URL, ENV} = process.env;
import { dbConnection } from './utils/Database';
