import * as bcrypt from 'bcrypt';
import { ClientEntity } from './client.entity';
import { PLAN_TYPES } from './plan.entity';
import { PasswordDoesNotMatchError } from '../errors';

jest.mock('bcrypt');

describe('Client - Entity', () => {
  beforeEach(() => {
    /**
     * Most important - it clears the cache
     */
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.clearAllTimers();
  });

  it('should return a new "Client" with valid parameters', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(
        (_data: string | Buffer, _saltOrRounds: string | number) =>
          Promise.resolve('hashed_password'),
      );
    jest.useFakeTimers().setSystemTime(new Date('1970-01-01'));

    const fullName = 'Adolfo Oliveira';
    const planCreateRechargeTime = Date.now();
    const planDeleteRechargeTime = Date.now();

    const entity = await ClientEntity.createNew({
      email: 'test@mail.com',
      fullName,
      password: '12345678xX#',
      planCreateRechargeTime,
      planDeleteRechargeTime,
      planTier: PLAN_TYPES.FREE,
      planId: '4132e2a3-5914-4226-bec5-d5cbbdaea903',
    });

    expect(entity.getValue().email.value).toBe('test@mail.com');
    expect(entity.getValue().fullName.value).toBe(fullName.toLowerCase());
    expect(entity.getValue().id.value).toBeDefined();
    expect(entity.getValue().linksCreationQuota).toBe(2);
    expect(entity.getValue().linksDeletionQuota).toBe(2);
    expect(entity.getValue().password.value).toBe('hashed_password');
    expect(entity.getValue().plan.getValue().id.value).toBe(
      '4132e2a3-5914-4226-bec5-d5cbbdaea903',
    );
    expect(entity.getValue().plan.getValue().linksCreationQuota).toBe(2);
    expect(entity.getValue().plan.getValue().linksCreationRechargeTime).toBe(
      planCreateRechargeTime,
    );
    expect(entity.getValue().plan.getValue().linksDeletionQuota).toBe(2);
    expect(entity.getValue().plan.getValue().linksDeletionRechargeTime).toBe(
      planDeleteRechargeTime,
    );
    expect(entity.getValue().plan.getValue().tier).toBe(PLAN_TYPES.FREE);
    expect(entity.getValue().planCreateRechargeTimeRefreshesIn.getTime()).toBe(
      0,
    );
    expect(entity.getValue().planDeleteRechargeTimeRefreshesIn.getTime()).toBe(
      0,
    );
  });

  it('should return a "Client" that already exists with valid parameters', () => {
    const fullName = 'Adolfo Oliveira';
    const planCreateRechargeTime = Date.now();
    const planDeleteRechargeTime = Date.now();

    const entity = ClientEntity.create({
      id: '4132e2a3-5914-4226-bec5-d5cbbdaea902',
      email: 'test@mail.com',
      fullName,
      password: 'hashed_password',
      planCreateRechargeTime,
      planDeleteRechargeTime,
      planTier: PLAN_TYPES.FREE,
      planId: '4132e2a3-5914-4226-bec5-d5cbbdaea903',
      linksCreationQuota: 1,
      linksDeletionQuota: 1,
      planCreateRechargeTimeRefreshesIn: 0,
      planDeleteRechargeTimeRefreshesIn: 0,
    });

    expect(entity.getValue().email.value).toBe('test@mail.com');
    expect(entity.getValue().fullName.value).toBe(fullName.toLowerCase());
    expect(entity.getValue().id.value).toBe(
      '4132e2a3-5914-4226-bec5-d5cbbdaea902',
    );
    expect(entity.getValue().linksCreationQuota).toBe(1);
    expect(entity.getValue().linksDeletionQuota).toBe(1);
    expect(entity.getValue().password.value).toBe('hashed_password');
    expect(entity.getValue().plan.getValue().id.value).toBe(
      '4132e2a3-5914-4226-bec5-d5cbbdaea903',
    );
    expect(entity.getValue().plan.getValue().linksCreationQuota).toBe(2);
    expect(entity.getValue().plan.getValue().linksCreationRechargeTime).toBe(
      planCreateRechargeTime,
    );
    expect(entity.getValue().plan.getValue().linksDeletionQuota).toBe(2);
    expect(entity.getValue().plan.getValue().linksDeletionRechargeTime).toBe(
      planDeleteRechargeTime,
    );
    expect(entity.getValue().plan.getValue().tier).toBe(PLAN_TYPES.FREE);
    expect(entity.getValue().planCreateRechargeTimeRefreshesIn.getTime()).toBe(
      0,
    );
    expect(entity.getValue().planDeleteRechargeTimeRefreshesIn.getTime()).toBe(
      0,
    );
  });

  it('should throw error if "Client" password do not match', async () => {
    const fullName = 'Adolfo Oliveira';
    const planCreateRechargeTime = Date.now();
    const planDeleteRechargeTime = Date.now();

    const wrongPasssword = 'wrong password';

    const entity = await ClientEntity.createNew({
      email: 'test@mail.com',
      fullName,
      password: '12345678xX#',
      planCreateRechargeTime,
      planDeleteRechargeTime,
      planTier: PLAN_TYPES.FREE,
      planId: '4132e2a3-5914-4226-bec5-d5cbbdaea903',
    });

    const promise = async () => await entity.checkPasswordMatch(wrongPasssword);

    await expect(promise).rejects.toThrow(new PasswordDoesNotMatchError());
  });

  afterAll(() => {
    /**
     * Most important - restores module to original implementation
     */
    jest.restoreAllMocks();
  });
});
