// Database agnostic interface
export interface IConnection {
  execute(sql: string, params?: any[] | Record<string, any>): Promise<any>;
  commit(): Promise<void>;
  close(): Promise<void>;
}

export interface IDatabase {
  getConnection(): Promise<IConnection>;
}
