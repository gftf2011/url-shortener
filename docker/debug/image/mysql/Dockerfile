FROM mysql:8.0-debian

LABEL maintainer="Gabriel Ferrari Tarallo Ferraz"

ARG mysql_root_user
ARG mysql_root_password
ARG mysql_database
ARG mysql_user
ARG mysql_password
ARG mysql_port
ARG mysql_conn

ENV MYSQL_ROOT_USER=${mysql_root_user}
ENV MYSQL_ROOT_PASSWORD=${mysql_root_password}
ENV MYSQL_DATABASE=${mysql_database}
ENV MYSQL_USER=${mysql_user}
ENV MYSQL_PASSWORD=${mysql_password}
ENV MYSQL_CONN=${mysql_conn}

USER root

COPY ./scripts/debug/mysql/custom.cnf.tpl /etc/mysql/custom.cnf.tpl
COPY ./scripts/debug/mysql/init.sh /docker-entrypoint-initdb.d/init.sh

RUN apt-get update
RUN apt-get install -y gettext-base

RUN touch /etc/mysql/conf.d/custom.cnf

RUN chmod 644 /etc/mysql/my.cnf
RUN chmod 644 /etc/mysql/conf.d/docker.cnf
RUN chmod 644 /etc/mysql/conf.d/custom.cnf

RUN envsubst < /etc/mysql/custom.cnf.tpl > /etc/mysql/conf.d/custom.cnf
RUN rm /etc/mysql/custom.cnf.tpl

EXPOSE ${mysql_port}

CMD ["mysqld"]