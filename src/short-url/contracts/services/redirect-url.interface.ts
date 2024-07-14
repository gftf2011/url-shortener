export interface IShortUrlService {
  create: (longUrl: string, clientId: string) => Promise<string>;
  get: (shortUrlId: string) => Promise<string>;
  delete: (clientId: string, shortUrlId: string) => Promise<void>;
}
