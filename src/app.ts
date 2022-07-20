require('source-map-support').install();

import {config} from 'dotenv';
config();

import mysqlDB from './db/mysql/mysql.db';
import jobsController from './controllers/jobs.controller';

(async function () {
  try {
    await mysqlDB.connect();

    await jobsController.startSchedule();
  }
  catch(e) {
    console.error("START ERROR: ", e);
  }
})()