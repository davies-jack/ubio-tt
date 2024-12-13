# Ubio Tech Test
## Discovery Service 🌍

This is a tech test for Ubio. It is a discovery service that allows you to register instances under groups, fetch them, and they will be automatically deleted after a configurable amount of time if they aren't given a heartbeat.

## Setup

Firstly, clone this repository and then run `npm install` to install the dependencies.

Copy `.env.example` to `.env` and fill in the values:

We are using MongoDB for the database, I have setup a docker-compose script to run a local instance of Mongo. To start it, ensure you have Docker installed and then run `docker compose up` in the root of the repository.

With the Mongo instance running, in one terminal window, run `npm run dev` to start the Typescript compiler in watch mode.

In another terminal window, run `npm start` to start the server. If you see a log message saying **Listening on 8080** then the server is running.

## How to run tests

With **both** the Typescript compiler (`npm run dev`) and the Mongo instance running, run `npm run test` to run the tests. This is done with Supertest, alongside Mocha and Chai.

## Considerations

If a document does not exist when you try to delete it, it will return a 404.

## Endpoints avaliable

### GET /

Fetches all instances in all groups.

### POST /{group}/{id}

Registers an instance under a group.

### GET /{group}

Fetches all instances in a group.

### DELETE /{group}/{id}

Deletes an instance from a group.