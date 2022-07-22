import mysql from '../db/mysql/mysql.db';

class TaskModel {
  getClosestTasks = async(): Promise<any> => {
    const [rows] = await mysql.client.query("CALL getClosestTasks()");
    return rows[0];
  }
}

export default new TaskModel();