import mysql from 'mysql2/promise';

class MysqlDb {
  public client;

  constructor() {
    this.client = null;
  }

  connect = async(): Promise<void> => {
    console.log('Connection to Mysql ...');

    this.client = mysql.createPool({
      host: process.env.MYSQL_HOSTNAME,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    try {
      await this.client.execute('Select 1+1 as result');
      console.log("Connected to MysqlDB!");
    }
    catch(e) {
      console.error("MysqlDb ERROR: ", e);
    }
  }
}

export default new MysqlDb();