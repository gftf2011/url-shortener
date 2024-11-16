[mysqld]
max_connections=${MYSQL_CONN}
server-id=2
log-bin=mysql-bin
gtid_mode=ON
enforce-gtid-consistency=ON
binlog_format=ROW
relay-log=relay-bin
transaction-write-set-extraction=XXHASH64
plugin-load-add=group_replication.so

# Group Replication settings
group_replication_group_name="6db4f0e8-b3f4-4cfa-83d4-527d4eaef917"
group_replication_start_on_boot=OFF
group_replication_local_address="core-db-worker:5432"
group_replication_group_seeds="core-db-main:5432,core-db-worker:5432"