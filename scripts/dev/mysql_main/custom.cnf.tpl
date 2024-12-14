[mysqld]
# General settings
user=${MYSQL_ROOT_USER}
port=3306
bind-address=0.0.0.0

default_authentication_plugin = mysql_native_password

# Replication
server-id=1
log-bin=/var/run/mysqld/mysql-bin.log
binlog_format=row
