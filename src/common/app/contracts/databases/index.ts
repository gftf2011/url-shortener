export interface ISingleDbConnection {
  connect: (masterConfig: any, slaveConfigs: any[]) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection(): Promise<any>;
}

export interface IDbConnection {
  connect: (masterConfig: any, slaveConfigs: any[]) => Promise<void>;
  disconnect: () => Promise<void>;
  getMasterConnection(): Promise<any>;
  getSlaveConnection(): Promise<any>;
}

export interface ISqlDbQuery {
  query: (queryText: string, values: any[]) => Promise<any>;
}

export interface ISqlDbClient {
  createClient: () => Promise<void>;
  close: () => Promise<void>;
}

export interface ISqlDbLocker {
  lockTable: (table: string) => Promise<void>;
  unlockTable: (table: string) => Promise<void>;
}

export interface ISqlMasterDbTransaction
  extends ISqlDbClient,
    ISqlDbQuery,
    ISqlDbLocker {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

export interface ISqlSlaveDbTransaction extends ISqlDbClient, ISqlDbQuery {
  release: () => Promise<void>;
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
