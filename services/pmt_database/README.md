# Pathways Mapping Toolkit Documentation: Database Service

## Configuration Overview

The database service for the pathways mapping toolkit (`services/pmt_database`) is provided by the [official preconfigured MySQL docker image](https://hub.docker.com/_/mysql) with some additional light configuration. (You can view and edit configuration in `my.cnf`)

### The Database Seed File and the Data Volume

If launched as a standalone service, the database will automagically seed from the MySQL dump contained in `create.sql`; however, when running as part of the whole application, the database reads and writes from a Docker data volume named `my-datavolume` (see any of the`pmt/docker-compose-*.yml` in the root directory). It will only use the seed data when no data can be found in the data volume.

This datavolume is persistent in that you can start/stop/update the application without affecting the state of the database. **However, all the data will be lost should you remove the volumes (see "Removing Volumes" [here](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes).)**

**It's important to note that the datavolume is entirely local to the host machine.** There will be a version of the database on the development machine and a disconnected version on the production server. For this reason, it is important to periodically **dump** the contents of the production server into a new seed file and update this in `pmt/services/pmt_database`. This way, the state of the production database is preserved at point.

### Backing Up The Database
