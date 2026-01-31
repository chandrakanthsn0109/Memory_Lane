declare module "oracledb" {
  export interface ConnectionAttributes {
    user?: string;
    password?: string;
    connectString?: string;
  }

  export interface Connection {
    execute(sql: string, params?: any[], options?: any): Promise<any>;
    commit(): Promise<void>;
    close(): Promise<void>;
  }

  export interface OracleDB {
    getConnection(attrs: ConnectionAttributes): Promise<Connection>;
  }

  const oracledb: OracleDB;
  export default oracledb;
}
