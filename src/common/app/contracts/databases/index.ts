export interface IDbConnection {
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection(): Promise<any>;
}

export interface ISqlDbQuery {
  query: (queryText: string, values: any[]) => Promise<any>;
}

export interface ISqlDbTransaction extends ISqlDbQuery {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  createClient: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  close: () => Promise<void>;
  lockReadTable: (table: string) => Promise<void>;
  unlockTables: () => Promise<void>;
}
