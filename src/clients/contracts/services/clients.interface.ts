import { ClientDTO } from 'src/clients/domain/dtos';

export interface IClientService {
  createAccount: (input: ClientDTO) => Promise<{ accessToken: string }>;
}
