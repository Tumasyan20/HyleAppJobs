import mysql from '../db/mysql/mysql.db';

class GoalsModel {
  getClosestMinuteGoals = async(): Promise<any> => {
    const [rows] = await mysql.client.query("CALL getClosestMinuteGoals()");
    return rows[0];
  }

  getClosestHourGoals = async(): Promise<any> => {
    const [rows] = await mysql.client.query("CALL getClosestHourGoals()");
    return rows[0];
  }
}

export default new GoalsModel();