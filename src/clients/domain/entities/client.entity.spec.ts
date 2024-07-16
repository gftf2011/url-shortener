import * as bcrypt from 'bcrypt';
import { ClientEntity } from './client.entity';
import { PLAN_TYPES } from './plan.entity';

jest.mock('bcrypt');

describe('Client - Entity', () => {
  beforeEach(() => {
    /**
     * Most important - it clears the cache
     */
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should return a new "Client" with valid parameters', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(
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
    expect(entity.getValue().plan.getValue().linksCreationRechargeTime).toBe(0);
    expect(entity.getValue().plan.getValue().linksDeletionQuota).toBe(2);
    expect(entity.getValue().plan.getValue().linksDeletionRechargeTime).toBe(0);
    expect(entity.getValue().plan.getValue().tier).toBe(PLAN_TYPES.FREE);
    expect(entity.getValue().planCreateRechargeTimeRefreshesIn.getTime()).toBe(
      planCreateRechargeTime,
    );
    expect(entity.getValue().planDeleteRechargeTimeRefreshesIn.getTime()).toBe(
      planDeleteRechargeTime,
    );
  });

  afterAll(() => {
    /**
     * Most important - restores module to original implementation
     */
    jest.restoreAllMocks();
  });
});
