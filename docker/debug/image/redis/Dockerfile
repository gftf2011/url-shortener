FROM redis:7.2.5-alpine

LABEL maintainer="Gabriel Ferrari Tarallo Ferraz"

ARG redis_server_pass
ARG redis_client_user
ARG redis_client_pass
ARG redis_port
ARG redis_host
ARG redis_conn

ENV REDIS_SERVER_PASS=${redis_server_pass}
ENV REDIS_CLIENT_USER=${redis_client_user}
ENV REDIS_CLIENT_PASS=${redis_client_pass}
ENV REDIS_PORT=${redis_port}
ENV REDIS_HOST=${redis_host}
ENV REDIS_CONN=${redis_conn}

USER root

COPY ./scripts/debug/redis/redis.conf.tpl /usr/local/etc/redis/redis.conf.tpl

RUN apk update
RUN apk --no-cache add \
    icu-dev \
    gettext \
    gettext-dev

RUN touch /usr/local/etc/redis/redis.conf

RUN envsubst < /usr/local/etc/redis/redis.conf.tpl > /usr/local/etc/redis/redis.conf
RUN rm /usr/local/etc/redis/redis.conf.tpl

EXPOSE ${redis_port}

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]