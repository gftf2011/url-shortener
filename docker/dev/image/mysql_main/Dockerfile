FROM mysql:8.0

LABEL maintainer="Gabriel Ferrari Tarallo Ferraz"

ARG mysql_root_user
ARG mysql_root_password
ARG mysql_database
ARG mysql_user
ARG mysql_password
ARG mysql_port
ARG mysql_conn
ARG mysql_replication_user
ARG mysql_replication_password

ENV MYSQL_ROOT_USER=${mysql_root_user}
ENV MYSQL_ROOT_PASSWORD=${mysql_root_password}
ENV MYSQL_DATABASE=${mysql_database}
ENV MYSQL_USER=${mysql_user}
ENV MYSQL_PASSWORD=${mysql_password}
ENV MYSQL_CONN=${mysql_conn}
ENV MYSQL_REPLICATION_USER=${mysql_replication_user}
ENV MYSQL_REPLICATION_PASSWORD=${mysql_replication_password}

USER root

COPY ./scripts/dev/mysql_main/custom.cnf.tpl /etc/mysql/conf.d/custom.cnf.tpl
COPY ./scripts/dev/mysql_main/init.sh /docker-entrypoint-initdb.d/init.sh

RUN microdnf update
RUN microdnf install -y gettext

RUN touch /etc/mysql/conf.d/custom.cnf

RUN chmod 644 /etc/mysql/conf.d/custom.cnf

RUN envsubst < /etc/mysql/conf.d/custom.cnf.tpl > /etc/mysql/conf.d/custom.cnf
RUN rm /etc/mysql/conf.d/custom.cnf.tpl

EXPOSE ${mysql_port}

CMD ["mysqld"]