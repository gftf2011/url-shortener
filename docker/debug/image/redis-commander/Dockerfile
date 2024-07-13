FROM rediscommander/redis-commander:latest

ARG port
ARG redis_client_host
ARG redis_client_port
ARG redis_client_db_index
ARG redis_client_pass

ENV REDIS_HOST=${redis_client_host}
ENV REDIS_PORT=${redis_client_port}
ENV REDIS_PASSWORD=${redis_client_pass}
ENV REDIS_DB_INDEX=${redis_client_db_index}

EXPOSE ${port}
