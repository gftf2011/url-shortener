export interface IDbConnection {
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection(): Promise<any>;
}

export interface ISqlDbQuery {
  query: (queryText: string, values: any[]) => Promise<any>;
}

export interface ISqlDbLocker {
  lockReadTable: (table: string) => Promise<void>;
  unlockTables: () => Promise<void>;
}

export interface ISqlDbTransaction extends ISqlDbQuery, ISqlDbLocker {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  createClient: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  close: () => Promise<void>;
}

export interface IKeyValueDbCommands {
  set: (
    key: string,
    value: string,
    options?: { ttl_in_milliseconds: number },
  ) => Promise<void>;
  get: (key: string) => Promise<string>;
  del: (key: string) => Promise<void>;
}

export interface IKeyValueDbTransaction extends IKeyValueDbCommands {
  createClient: () => Promise<void>;
  close: () => Promise<void>;
  release: () => Promise<void>;
}
