# Pathways Mapping Toolkit Documentation

## Architecture Overview

The Pathways Mapping Toolkit is deployed using a _microservices architecture_-- that is, the web application is broken down into 5 distinct services

Backend Services:

1. Database Service (`services/pmt_database`)
2. API Service (`services/dmt_backend`)
3. HTTP Service (`services/pmt_nginx`)

Frontend Services:

4. Map Editor Service (`services/dmt_frontend`)
5. Reports/Admin Service (`services/pmt_reports`)

and each service is deployed in a [Docker](https://www.docker.com/) container using [Docker Compose](https://docs.docker.com/compose/). Production-ready builds are served by [Docker Hub](https://hub.docker.com/). This architecture ensures several important freedoms:

- The configuration and dependencies of each service are transparently documented in Dockerfiles and totally independent of the other services.
- The configuration and dependencies of each service are independent of the configuration of the host machine or developer machines, except for the very small set of [dependencies associated with Docker](#project-dependencies).
- Services may be freely implemented with a variety of languges and build processes without concern for how these dependencies might interact on a development/deployment machine.
- From the perspective of the individual services, there is nearly no difference between the development and deployment environments. If everything works in development, it will work in deployment (with the single exception of [environment variables](#environment-variables).)
- Once the dependencies for Docker and Docker Compose are installed, deployment is handled by the following two commands:

  `docker-compose pull`  
   `docker-compose up --build`

## Project Dependencies and Deployment

The Pathways Mapping Toolkit has two primary dependencies:

- [Docker](http://www.docker.com)
- [Docker Compose](http://docs.docker.com/compose)

As mentioned above, all of the remaining configuration for the individual microservices are handled by their respective containers.

### To Deploy PMT for development:

0. Install Docker and Docker Compose on the development machine.
1. Navigate to desired development directory.
1. Clone the `mattl3w1s/pmt` repository on Github by running the following in a posix shell (or Windows equivalent).  
   `git clone https://github.com/mattl3w1s/pmt.git`
1. Navigate to the `pmt` directory.
1. Spin up the docker containers by executing the following commands:  
   `docker-compose up --build`

Upon making changes, reissue the `docker-compose` command, above, to incorporate changes and relaunch application.

### To Deploy PMT for production:

0. Install Docker and Docker Compose on host machine.
1. (On Development Machine) If you have made changes to the application since the previous deployment, make sure to push changes to [Docker Hub](https://hub.docker.com/) by running `docker-compose push` on the **development machine**.
1. (On Host Machine) Pull any changes from [Docker Hub](https://hub.docker.com/) by running `docker-compose pull` on the **host machine**.
1. Make sure an updated version `docker-compose-prod.yml` is in the desired directory on the host machine.
1. Navigate to the directory containing the `docker-compose-prod.yml` and run the following command:  
   `docker-compose up`
