[mysqld]
# General settings
user=${MYSQL_ROOT_USER}
port=3306
bind-address=0.0.0.0
skip-host-cache
skip-name-resolve

# Data directories
datadir=/var/lib/mysql
socket=/var/run/mysqld/mysqld.sock
pid-file=/var/run/mysqld/mysqld.pid

# Logging
log-error=/var/log/mysql/error.log

# Networking
max_connections=${MYSQL_CONN}
connect_timeout=10
wait_timeout=28800
interactive_timeout=28800

# Security
secure-file-priv=NULL

# Performance tuning
key_buffer_size=8388608
max_allowed_packet=4194304
table_open_cache=2000
sort_buffer_size=2097152
read_buffer_size=131072
read_rnd_buffer_size=262144
net_buffer_length=16384
thread_stack=262144

# InnoDB settings
default_storage_engine=InnoDB
innodb_file_per_table=1
innodb_buffer_pool_size=134217728
innodb_log_file_size=5242880
innodb_flush_log_at_trx_commit=1

# Replication (if needed)
server-id=1
log_bin=mysql-bin
binlog_format=row
sync_binlog=1

[client]
port=3306
socket=/var/run/mysqld/mysqld.sock

[mysql]
no_auto_rehash

[mysqld_safe]
log-error=/var/log/mysql/mysqld_safe.log
pid-file=/var/run/mysqld/mysqld.pid
