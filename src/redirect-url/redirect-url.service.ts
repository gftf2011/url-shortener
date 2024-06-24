import { Inject, Injectable } from '@nestjs/common';
import { RedirectURLEntity } from './domain/entities';
import {
  IGetLastIdRedirectUrlRepository,
  IIncreaseLastIdRedirectUrlRepository,
  ISaveRedirectUrlRepository,
} from './domain/repositories/redirect-url';
import { IRedirectUrlService } from './contracts/services';
import {
  IFindByIdClientRepository,
  IUpdateClientRepository,
} from '../clients/domain/repositories/clients';

type IRedirectUrlRepository = IGetLastIdRedirectUrlRepository &
  ISaveRedirectUrlRepository &
  IIncreaseLastIdRedirectUrlRepository;

type IClientRepository = IFindByIdClientRepository & IUpdateClientRepository;

@Injectable()
export class RedirectUrlService implements IRedirectUrlService {
  constructor(
    @Inject('IRedirectUrlRepository')
    private readonly redirectUrlRepo: IRedirectUrlRepository,
    @Inject('IClientRepository')
    private readonly clientRepo: IClientRepository,
  ) {}

  async create(longUrl: string, clientId: string): Promise<string> {
    const id = (await this.redirectUrlRepo.getLastId()) as string;
    const redirectUrl = RedirectURLEntity.create({ id, longUrl, clientId });
    const clientFound = await this.clientRepo.findById(
      redirectUrl.getValue().clientId,
    );
    if (!clientFound) {
      throw new Error('client does not exists');
    }
    clientFound.confirmLinkCretion();
    await this.clientRepo.update(clientFound);
    await this.redirectUrlRepo.save(redirectUrl);
    await this.redirectUrlRepo.increaseLastId(redirectUrl);
    return redirectUrl.getValue().id.value;
  }
}
