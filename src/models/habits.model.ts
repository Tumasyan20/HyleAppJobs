import mysql from '../db/mysql/mysql.db';

class HabitsModel {
  getClosestHabits = async(): Promise<any> => {
    const [rows] = await mysql.client.query("CALL getClosestHabits()");
    return rows[0];
  }
}

export default new HabitsModel();