-- Switch to database

USE core_app;

-- Create schemas

CREATE SCHEMA IF NOT EXISTS clients_schema CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE SCHEMA IF NOT EXISTS short_urls_schema CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- Create tables

CREATE TABLE IF NOT EXISTS clients_schema.plans (
    id VARCHAR(36),
    duration INT NOT NULL,
    tier ENUM('FREE') UNIQUE NOT NULL
);

ALTER TABLE clients_schema.plans ADD CONSTRAINT pk_plans_id PRIMARY KEY (id);

CREATE UNIQUE INDEX idx_btree_plans_by_id ON clients_schema.plans (id);
CREATE UNIQUE INDEX idx_btree_plans_by_tier ON clients_schema.plans (tier);

INSERT INTO clients_schema.plans (id, duration, tier) VALUES ('5532b773-be2f-42e5-a4da-a0856bf0d62c', 3600000, 'FREE');

CREATE TABLE IF NOT EXISTS clients_schema.clients (
    id VARCHAR(36),
    email VARCHAR(320) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    plan_id VARCHAR(36) NOT NULL
);

ALTER TABLE clients_schema.clients ADD CONSTRAINT pk_clients_id PRIMARY KEY (id);
ALTER TABLE clients_schema.clients ADD CONSTRAINT fk_clients_plan_id FOREIGN KEY (plan_id) REFERENCES clients_schema.plans (id) ON UPDATE CASCADE;

CREATE UNIQUE INDEX idx_btree_clients_by_email ON clients_schema.clients(email);
CREATE UNIQUE INDEX idx_btree_clients_by_id ON clients_schema.clients(id);

CREATE TABLE IF NOT EXISTS clients_schema.quota (
    client_id VARCHAR(36),
    plan_id VARCHAR(36) NOT NULL,
    quota INT NOT NULL,
    refresh_in BIGINT NOT NULL
);

ALTER TABLE clients_schema.quota ADD CONSTRAINT pk_quota_client_id PRIMARY KEY (client_id);
ALTER TABLE clients_schema.quota ADD CONSTRAINT fk_quota_client_id FOREIGN KEY (client_id) REFERENCES clients_schema.clients (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE clients_schema.quota ADD CONSTRAINT fk_quota_plan_id FOREIGN KEY (plan_id) REFERENCES clients_schema.plans (id) ON UPDATE CASCADE;

CREATE UNIQUE INDEX idx_btree_quota_by_client_id_plan_id ON clients_schema.quota (plan_id, client_id);

CREATE TABLE IF NOT EXISTS short_urls_schema.counter (
    table_name VARCHAR(255),
    last_id TINYTEXT NOT NULL
);

ALTER TABLE short_urls_schema.counter ADD CONSTRAINT pk_counter_client_id PRIMARY KEY (table_name);

CREATE UNIQUE INDEX idx_btree_counter_by_table_name ON short_urls_schema.counter (table_name);

INSERT INTO short_urls_schema.counter (table_name, last_id) VALUES ('short_urls', '0000000000');

CREATE TABLE IF NOT EXISTS short_urls_schema.short_urls (
    id VARCHAR(10),
    client_id VARCHAR(36) NOT NULL,
    long_url TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

ALTER TABLE short_urls_schema.short_urls ADD CONSTRAINT pk_short_urls_id PRIMARY KEY (id);
ALTER TABLE short_urls_schema.short_urls ADD CONSTRAINT fk_short_urls_client_id FOREIGN KEY (client_id) REFERENCES clients_schema.clients (id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE UNIQUE INDEX idx_btree_short_urls_by_id ON short_urls_schema.short_urls (id);

GRANT SELECT ON clients_schema.plans TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE ON clients_schema.clients TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE ON clients_schema.quota TO 'app'@'%';
GRANT SELECT, INSERT ON short_urls_schema.short_urls TO 'app'@'%';
GRANT SELECT, UPDATE ON short_urls_schema.counter TO 'app'@'%';
GRANT LOCK TABLES ON short_urls_schema.* TO 'app'@'%';

FLUSH PRIVILEGES;
