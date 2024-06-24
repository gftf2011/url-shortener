export interface IRedirectUrlService {
  create: (longUrl: string, clientId: string) => Promise<string>;
}
