#!/bin/bash

set -e

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "START GROUP_REPLICATION;"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE SCHEMA IF NOT EXISTS clients_schema CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE SCHEMA IF NOT EXISTS short_urls_schema CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE TABLE IF NOT EXISTS clients_schema.plans (id VARCHAR(36), create_recharge_time INT NOT NULL, delete_recharge_time INT NOT NULL, tier ENUM('FREE') UNIQUE NOT NULL);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE clients_schema.plans ADD CONSTRAINT pk_plans_id PRIMARY KEY (id);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE UNIQUE INDEX idx_btree_plans_by_id ON clients_schema.plans (id);"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE UNIQUE INDEX idx_btree_plans_by_tier ON clients_schema.plans (tier);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "INSERT INTO clients_schema.plans (id, create_recharge_time, delete_recharge_time, tier) VALUES ('5532b773-be2f-42e5-a4da-a0856bf0d62c', 3600000, 3600000, 'FREE');"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE TABLE IF NOT EXISTS clients_schema.clients (id VARCHAR(36), email VARCHAR(320) UNIQUE NOT NULL, password TEXT NOT NULL, full_name VARCHAR(255) NOT NULL, plan_id VARCHAR(36) NOT NULL);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE clients_schema.clients ADD CONSTRAINT pk_clients_id PRIMARY KEY (id);"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE clients_schema.clients ADD CONSTRAINT fk_clients_plan_id FOREIGN KEY (plan_id) REFERENCES clients_schema.plans (id) ON UPDATE CASCADE;"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE UNIQUE INDEX idx_btree_clients_by_email ON clients_schema.clients(email);"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE UNIQUE INDEX idx_btree_clients_by_id ON clients_schema.clients(id);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE TABLE IF NOT EXISTS clients_schema.quota (client_id VARCHAR(36), plan_id VARCHAR(36) NOT NULL, quota_remaining_creation_links INT NOT NULL, quota_remaining_deletion_links INT NOT NULL, plan_create_recharge_time_refreshes_in BIGINT NOT NULL, plan_delete_recharge_time_refreshes_in BIGINT NOT NULL);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE clients_schema.quota ADD CONSTRAINT pk_quota_client_id PRIMARY KEY (client_id);"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE clients_schema.quota ADD CONSTRAINT fk_quota_client_id FOREIGN KEY (client_id) REFERENCES clients_schema.clients (id) ON DELETE CASCADE ON UPDATE CASCADE;"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE clients_schema.quota ADD CONSTRAINT fk_quota_plan_id FOREIGN KEY (plan_id) REFERENCES clients_schema.plans (id) ON UPDATE CASCADE;"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE UNIQUE INDEX idx_btree_quota_by_client_id_plan_id ON clients_schema.quota (plan_id, client_id);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE TABLE IF NOT EXISTS short_urls_schema.counter (table_name VARCHAR(255), last_id TINYTEXT NOT NULL);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE short_urls_schema.counter ADD CONSTRAINT pk_counter_client_id PRIMARY KEY (table_name);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE UNIQUE INDEX idx_btree_counter_by_table_name ON short_urls_schema.counter (table_name);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "INSERT INTO short_urls_schema.counter (table_name, last_id) VALUES ('short_urls', '0000000000');"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE TABLE IF NOT EXISTS short_urls_schema.short_urls (id VARCHAR(10), client_id VARCHAR(36) NOT NULL, long_url TEXT NOT NULL, created_at BIGINT NOT NULL, deleted_at BIGINT DEFAULT NULL, is_deleted BOOLEAN NOT NULL DEFAULT false);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE short_urls_schema.short_urls ADD CONSTRAINT pk_short_urls_id PRIMARY KEY (id);"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "ALTER TABLE short_urls_schema.short_urls ADD CONSTRAINT fk_short_urls_client_id FOREIGN KEY (client_id) REFERENCES clients_schema.clients (id) ON UPDATE CASCADE ON DELETE CASCADE;"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "CREATE UNIQUE INDEX idx_btree_short_urls_by_id ON short_urls_schema.short_urls (id);"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "GRANT SELECT ON clients_schema.plans TO '${MYSQL_USER}'@'%';"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "GRANT SELECT, INSERT, UPDATE ON clients_schema.clients TO '${MYSQL_USER}'@'%';"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "GRANT SELECT, INSERT, UPDATE ON clients_schema.quota TO '${MYSQL_USER}'@'%';"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "GRANT SELECT, INSERT, UPDATE ON short_urls_schema.short_urls TO '${MYSQL_USER}'@'%';"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "GRANT SELECT, UPDATE ON short_urls_schema.counter TO '${MYSQL_USER}'@'%';"
mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "GRANT LOCK TABLES ON short_urls_schema.* TO '${MYSQL_USER}'@'%';"

mysql -u ${MYSQL_ROOT_USER} --password="${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} -e "FLUSH PRIVILEGES;"
