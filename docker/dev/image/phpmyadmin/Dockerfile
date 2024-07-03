FROM phpmyadmin:5.2.1-apache

LABEL maintainer="Gabriel Ferrari Tarallo Ferraz"

ARG mysql_root_password
ARG phpmyadmin_port
ARG phpmyadmin_pma_host
ARG phpmyadmin_pma_port
ARG phpmyadmin_pma_arbitrary

ENV MYSQL_ROOT_PASSWORD=${mysql_root_password}
ENV PMA_HOST=${phpmyadmin_pma_host}
ENV PMA_PORT=${phpmyadmin_pma_port}
ENV PMA_ARBITRARY=${phpmyadmin_pma_arbitrary}

EXPOSE ${phpmyadmin_port}