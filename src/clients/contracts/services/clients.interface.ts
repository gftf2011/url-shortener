import { ClientDTO, CredentialsDTO } from '../../domain/dtos';

export interface IClientService {
  createAccount: (input: ClientDTO) => Promise<{ accessToken: string }>;
  loginToAccount: (input: CredentialsDTO) => Promise<{ accessToken: string }>;
}
