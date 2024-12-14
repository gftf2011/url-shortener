FROM mysql:8.0

LABEL maintainer="Gabriel Ferrari Tarallo Ferraz"

ARG mysql_root_user
ARG mysql_root_password
ARG mysql_database
ARG mysql_user
ARG mysql_password
ARG mysql_port
ARG mysql_conn
ARG mysql_master_database
ARG mysql_master_database_host
ARG mysql_master_database_user
ARG mysql_master_database_password
ARG mysql_master_replication_user
ARG mysql_master_replication_password

ENV MYSQL_ROOT_USER=${mysql_root_user}
ENV MYSQL_ROOT_PASSWORD=${mysql_root_password}
ENV MYSQL_DATABASE=${mysql_database}
ENV MYSQL_USER=${mysql_user}
ENV MYSQL_PASSWORD=${mysql_password}
ENV MYSQL_CONN=${mysql_conn}
ENV MYSQL_MASTER_DATABASE=${mysql_master_database}
ENV MYSQL_MASTER_DATABASE_HOST=${mysql_master_database_host}
ENV MYSQL_MASTER_DATABASE_USER=${mysql_master_database_user}
ENV MYSQL_MASTER_DATABASE_PASSWORD=${mysql_master_database_password}
ENV MYSQL_MASTER_REPLICATION_USER=${mysql_master_replication_user}
ENV MYSQL_MASTER_REPLICATION_PASSWORD=${mysql_master_replication_password}

USER root

COPY ./scripts/dev/mysql_worker/custom.cnf.tpl /etc/mysql/conf.d/custom.cnf.tpl
COPY ./scripts/dev/mysql_worker/init.sh /docker-entrypoint-initdb.d/init.sh

RUN microdnf update
RUN microdnf install -y gettext

RUN touch /etc/mysql/conf.d/custom.cnf

RUN chmod 644 /etc/mysql/conf.d/custom.cnf

RUN envsubst < /etc/mysql/conf.d/custom.cnf.tpl > /etc/mysql/conf.d/custom.cnf
RUN rm /etc/mysql/conf.d/custom.cnf.tpl

EXPOSE ${mysql_port}

CMD ["mysqld"]