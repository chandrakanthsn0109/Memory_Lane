import "dotenv/config";
import oracledb from "oracledb";
import { IConnection, IDatabase } from "../interfaces/IDatabase";

class OracleConnection implements IConnection {
  constructor(private connection: any) {}

  async execute(sql: string, params?: any[] | Record<string, any>): Promise<any> {
    return await this.connection.execute(sql, params);
  }

  async commit(): Promise<void> {
    await this.connection.commit();
  }

  async close(): Promise<void> {
    await this.connection.close();
  }
}

class OracleDatabase implements IDatabase {
  async getConnection(): Promise<IConnection> {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
    return new OracleConnection(connection);
  }
}

export const oracleDb = new OracleDatabase();
