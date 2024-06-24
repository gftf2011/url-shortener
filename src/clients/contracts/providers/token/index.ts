export interface ITokenProvider {
  sign: (payload: any) => Promise<string>;
  verify: (token: string) => Promise<any>;
}
