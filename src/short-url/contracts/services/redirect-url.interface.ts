export interface IShortUrlService {
  create: (longUrl: string, clientId: string) => Promise<string>;
}
