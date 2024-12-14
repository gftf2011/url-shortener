import mysql from 'mysql2/promise';
import {
  EmailValueObject,
  UUIDValueObject,
} from '../../../domain/value-objects';
import { ClientEntity, PLAN_TYPES, PlanEntity } from '../../../domain/entities';
import { IClientRepository } from '../../../domain/repositories/clients';
import { Inject, Injectable } from '@nestjs/common';
import { ISqlDbQuery } from '../../../../common/app/contracts/databases';

@Injectable()
export class MySqlClientsRepository implements IClientRepository {
  constructor(
    @Inject('ISqlSlaveDbTransaction') private readonly readQueryDb: ISqlDbQuery,
    @Inject('ISqlMasterDbTransaction')
    private readonly writeQueryDb: ISqlDbQuery,
  ) {}

  async save(entity: ClientEntity): Promise<void> {
    const command1 =
      'INSERT INTO clients_schema.clients (id, email, password, full_name, plan_id) VALUES (?, ?, ?, ?, ?);';
    const values1 = [
      entity.getValue().id.value,
      entity.getValue().email.value,
      entity.getValue().password.value,
      entity.getValue().fullName.value,
      entity.getValue().plan.getValue().id.value,
    ];

    const command2 =
      'INSERT INTO clients_schema.quota (client_id, plan_id, quota_remaining_creation_links, quota_remaining_deletion_links, plan_create_recharge_time_refreshes_in, plan_delete_recharge_time_refreshes_in) VALUES (?, ?, ?, ?, ?, ?);';
    const values2 = [
      entity.getValue().id.value,
      entity.getValue().plan.getValue().id.value,
      entity.getValue().linksCreationQuota,
      entity.getValue().linksDeletionQuota,
      entity.getValue().planCreateRechargeTimeRefreshesIn.getTime(),
      entity.getValue().planDeleteRechargeTimeRefreshesIn.getTime(),
    ];

    await (this.writeQueryDb as mysql.PoolConnection).query(command1, values1);
    await (this.writeQueryDb as mysql.PoolConnection).query(command2, values2);
  }

  async findByEmail(email: EmailValueObject): Promise<ClientEntity> {
    const command1 = 'SELECT * FROM clients_schema.clients WHERE email = ?;';
    const values1 = [email.value];

    const [clientRows] = await (this.readQueryDb as mysql.PoolConnection).query(
      command1,
      values1,
    );

    if ((clientRows as any[]).length === 0) {
      return null;
    }

    const command2 =
      'SELECT * FROM clients_schema.quota WHERE client_id = ? AND plan_id = ?;';
    const values2 = [clientRows[0].id, clientRows[0].plan_id];

    const [clientPlanRows] = await (
      this.readQueryDb as mysql.PoolConnection
    ).query(command2, values2);

    const command3 = 'SELECT * FROM clients_schema.plans WHERE id = ?;';
    const values3 = [clientPlanRows[0].plan_id];

    const [planRows] = await (this.readQueryDb as mysql.PoolConnection).query(
      command3,
      values3,
    );

    return ClientEntity.create({
      email: clientRows[0].email,
      id: clientRows[0].id,
      password: clientRows[0].password,
      fullName: clientRows[0].full_name,
      planId: clientPlanRows[0].plan_id,
      linksCreationQuota: clientPlanRows[0].quota_remaining_creation_links,
      linksDeletionQuota: clientPlanRows[0].quota_remaining_deletion_links,
      planCreateRechargeTimeRefreshesIn:
        clientPlanRows[0].plan_create_recharge_time_refreshes_in,
      planDeleteRechargeTimeRefreshesIn:
        clientPlanRows[0].plan_delete_recharge_time_refreshes_in,
      planCreateRechargeTime: planRows[0].create_recharge_time,
      planDeleteRechargeTime: planRows[0].delete_recharge_time,
      planTier: PLAN_TYPES[planRows[0].tier],
    });
  }

  async findPlanByTier(tier: PLAN_TYPES): Promise<PlanEntity> {
    const command = 'SELECT * FROM clients_schema.plans WHERE tier = ?;';
    const values = [tier];
    const [rows] = await (this.readQueryDb as mysql.PoolConnection).query(
      command,
      values,
    );

    return PlanEntity.create({
      linksCreationRechargeTime: rows[0].create_recharge_time,
      linksDeletionRechargeTime: rows[0].delete_recharge_time,
      tier: rows[0].tier,
      id: rows[0].id,
    });
  }

  async findById(id: UUIDValueObject): Promise<ClientEntity> {
    const command1 = 'SELECT * FROM clients_schema.clients WHERE id = ?;';
    const values1 = [id.value];

    const [clientRows] = await (this.readQueryDb as mysql.PoolConnection).query(
      command1,
      values1,
    );

    if ((clientRows as any[]).length === 0) {
      return null;
    }

    const command2 = 'SELECT * FROM clients_schema.quota WHERE client_id = ?;';
    const values2 = [clientRows[0].id];

    const [clientPlanRows] = await (
      this.readQueryDb as mysql.PoolConnection
    ).query(command2, values2);

    const command3 = 'SELECT * FROM clients_schema.plans WHERE id = ?;';
    const values3 = [clientPlanRows[0].plan_id];

    const [planRows] = await (this.readQueryDb as mysql.PoolConnection).query(
      command3,
      values3,
    );

    return ClientEntity.create({
      email: clientRows[0].email,
      id: clientRows[0].id,
      password: clientRows[0].password,
      fullName: clientRows[0].full_name,
      planId: clientPlanRows[0].plan_id,
      linksCreationQuota: clientPlanRows[0].quota_remaining_creation_links,
      linksDeletionQuota: clientPlanRows[0].quota_remaining_deletion_links,
      planCreateRechargeTimeRefreshesIn:
        clientPlanRows[0].plan_create_recharge_time_refreshes_in,
      planDeleteRechargeTimeRefreshesIn:
        clientPlanRows[0].plan_delete_recharge_time_refreshes_in,
      planCreateRechargeTime: planRows[0].create_recharge_time,
      planDeleteRechargeTime: planRows[0].delete_recharge_time,
      planTier: PLAN_TYPES[planRows[0].tier],
    });
  }

  async update(entity: ClientEntity): Promise<void> {
    const command1 =
      'UPDATE clients_schema.clients SET email = ?, password = ?, full_name = ?, plan_id = ? WHERE id = ?;';
    const values1 = [
      entity.getValue().email.value,
      entity.getValue().password.value,
      entity.getValue().fullName.value,
      entity.getValue().plan.getValue().id.value,
      entity.getValue().id.value,
    ];

    await (this.writeQueryDb as mysql.PoolConnection).query(command1, values1);

    const command2 =
      'UPDATE clients_schema.quota SET plan_id = ?, quota_remaining_creation_links = ?, quota_remaining_deletion_links = ?, plan_create_recharge_time_refreshes_in = ?, plan_delete_recharge_time_refreshes_in = ? WHERE client_id = ?;';
    const values2 = [
      entity.getValue().plan.getValue().id.value,
      entity.getValue().linksCreationQuota,
      entity.getValue().linksDeletionQuota,
      entity.getValue().planCreateRechargeTimeRefreshesIn.getTime(),
      entity.getValue().planDeleteRechargeTimeRefreshesIn.getTime(),
      entity.getValue().id.value,
    ];

    await (this.writeQueryDb as mysql.PoolConnection).query(command2, values2);
  }
}
