import mysql from '../db/mysql/mysql.db';
import {IReminder} from "../interfaces/IReminder.interface";
import {IDataForNotification} from "../interfaces/IDataForNotification.interface";

class ReminderModel {
  getClosestRemindersForMinute = async (): Promise<Array<IReminder>> => {
    const [rows] = await mysql.client.query("CALL getClosestMinuteReminders()");
    return rows[0];
  }

  getClosestRemindersForHour = async(): Promise<Array<IReminder>> => {
    const [rows] = await mysql.client.query("CALL getClosestHourReminders() ");
    return rows[0];
  }

  test = async() => {
    const [rows] = await mysql.client.query("CALL test()");
    return
  }
}

export default new ReminderModel();