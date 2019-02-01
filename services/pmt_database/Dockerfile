# base image
FROM mysql:8.0.13

COPY ./create.sql ./docker-entrypoint-initdb.d
COPY ./my.cnf /etc/mysql/my.cnf

ENV MYSQL_ROOT_PASSWORD Szw42elk!