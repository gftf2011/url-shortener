import { ClientsService } from './clients.service';
import { ITokenProvider } from './contracts/providers/token';
import { ClientEntity, PLAN_TYPES } from './domain/entities';
import { IClientRepository } from './domain/repositories/clients';
import { AccountAlreadyExistsError, AccountDoesNotExistsError } from './errors';
import { DummyTokenProvider, StubTokenProvider } from './infra/providers/token';
import { FakeInMemoryClientsRepository } from './infra/repositories/clients';

describe('Client - Service', () => {
  describe('createAccount - function', () => {
    beforeEach(() => {
      /**
       * Most important - it clears the cache
       */
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.clearAllTimers();
    });

    it('should throw error if "Client" already exists', async () => {
      let fakeRepoModule: any;

      /**
       * Jest Isolation Module
       *
       * Module used is a Singleton Class, to create a fresh singleton in each test
       * it's necessary to isolate the module with jest.isolateModules
       *
       * This creates a sandbox where after the test execution the sandbox is destroyed
       */
      jest.isolateModules(() => {
        fakeRepoModule = require('./infra/repositories/clients');
      });

      const { FakeInMemoryClientsRepository } = fakeRepoModule;

      const dummyProvider: ITokenProvider = new DummyTokenProvider();
      const fakeRepo: IClientRepository =
        FakeInMemoryClientsRepository.getInstance() as FakeInMemoryClientsRepository;

      const fullName = 'Adolfo Oliveira';
      const email = 'test@mail.com';
      const password = '12345678xX#';
      const planCreateRechargeTime = Date.now();
      const planDeleteRechargeTime = Date.now();

      const plan = await fakeRepo.findPlanByTier(PLAN_TYPES.FREE);

      const entity = await ClientEntity.createNew({
        email,
        fullName,
        password,
        planCreateRechargeTime,
        planDeleteRechargeTime,
        planTier: plan.getValue().tier,
        planId: plan.getValue().id.value,
      });

      await fakeRepo.save(entity);

      const sut = new ClientsService(fakeRepo, dummyProvider);

      const promise = sut.createAccount({ email, fullName, password });

      await expect(promise).rejects.toThrow(new AccountAlreadyExistsError());
    });

    it('should return "accessToken"', async () => {
      let fakeRepoModule: any;

      /**
       * Jest Isolation Module
       *
       * Module used is a Singleton Class, to create a fresh singleton in each test
       * it's necessary to isolate the module with jest.isolateModules
       *
       * This creates a sandbox where after the test execution the sandbox is destroyed
       */
      jest.isolateModules(() => {
        fakeRepoModule = require('./infra/repositories/clients');
      });

      const { FakeInMemoryClientsRepository } = fakeRepoModule;

      const stubProvider: ITokenProvider = new StubTokenProvider(
        [Promise.resolve('access-token')],
        [],
      );
      const fakeRepo: IClientRepository =
        FakeInMemoryClientsRepository.getInstance() as FakeInMemoryClientsRepository;

      const fullName = 'Adolfo Oliveira';
      const email = 'test@mail.com';
      const password = '12345678xX#';

      const sut = new ClientsService(fakeRepo, stubProvider);

      const response = await sut.createAccount({ email, fullName, password });

      expect(response.accessToken).toBe('access-token');
    });

    afterAll(() => {
      /**
       * Most important - restores module to original implementation
       */
      jest.restoreAllMocks();
      jest.useRealTimers();
    });
  });

  describe('loginToAccount - function', () => {
    beforeEach(() => {
      /**
       * Most important - it clears the cache
       */
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.clearAllTimers();
    });

    it('should throw error if "Client" does not exists', async () => {
      let fakeRepoModule: any;

      /**
       * Jest Isolation Module
       *
       * Module used is a Singleton Class, to create a fresh singleton in each test
       * it's necessary to isolate the module with jest.isolateModules
       *
       * This creates a sandbox where after the test execution the sandbox is destroyed
       */
      jest.isolateModules(() => {
        fakeRepoModule = require('./infra/repositories/clients');
      });

      const { FakeInMemoryClientsRepository } = fakeRepoModule;

      const dummyProvider: ITokenProvider = new DummyTokenProvider();
      const fakeRepo: IClientRepository =
        FakeInMemoryClientsRepository.getInstance() as FakeInMemoryClientsRepository;

      const email = 'test@mail.com';
      const password = '12345678xX#';

      const sut = new ClientsService(fakeRepo, dummyProvider);

      const promise = sut.loginToAccount({ email, password });

      await expect(promise).rejects.toThrow(new AccountDoesNotExistsError());
    });

    afterAll(() => {
      /**
       * Most important - restores module to original implementation
       */
      jest.restoreAllMocks();
      jest.useRealTimers();
    });
  });
});
