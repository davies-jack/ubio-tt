# Ubio Tech Test
## Discovery Service 🌍

This is a tech test for Ubio. It is a discovery service that allows you to register instances under groups, fetch them, and they will be automatically deleted after a configurable amount of time if they aren't given a heartbeat.

## Setup

Firstly, clone this repository and then run `npm install` to install the dependencies.

Copy `.env.example` to `.env` and fill in the values:

We are using MongoDB for the database, I have setup a docker-compose script to run a local instance of Mongo. To start it, ensure you have Docker installed:

```bash
// with docker compose
docker compose up

// or with docker
docker run -d \
--name mongodb \
-p 27017:27017 \
-v mongodb_data:/data/db \
mongodb:latest
```

With the Mongo instance running, in one terminal window, run `npm run dev` to start the Typescript compiler in watch mode.

In another terminal window, run `npm start` to start the server. If you see a log message saying **Listening on 8080** then the server is running.

## How to run tests

With **both** the Typescript compiler (`npm run dev`) and the Mongo instance running, run `npm run test` to run the tests. This is done with Supertest, alongside Mocha and Chai.

## Considerations

If there are no groups in the database, the `GET /` route will return a 404 and an error message.

If a document does not exist when you try to delete it, it will return a 404 and an error message.

If there are no instances in a group, the `GET /{group}` route will return a 404 and an error message.

I added a `repositories` folder within `test` to test the `InstanceRepository` class. I originally had the `wipeDatabase` method within the `InstanceRepository` class, but I moved it to the `TestInstanceRepository` class for better test isolation.

I chose [Railway.app](https://railway.app) to deploy this service. I used this due to the ease of use, the free tier and the ability to easily set up a MongoDB instance without having to go to Mongo Atlas, etc. Railway also works really well with scaling, it's very easy to change the amount of instances (replicas) in the service settings. If you have multiple replicas, Railway also handles the load balancing between them! It has a further option to integrate Cloudflare too.

I originally was going to allow `meta` to be an optional property, but in an actual production use I would imagine that the instances would always have some metadata associated with them (location, info about the instance, etc), so I kept it as a required property.

If this project grew:

-   Error handling would be a good next step for this project. If anything goes wrong at any point, it would be good to have a way to handle these errors gracefully using a middleware.
-   Some kind of authentication would be a good next step - I would imagine that this wouldn't be a public service, and so would need to authenticate the requests.

## Deployment

This app is deployed on [Railway.app](https://railway.app). You can visit the live version [here](https://ubio-tt-production.up.railway.app/).

To deploy this app, I use version tags. Doing this on Railway means creating a deploy script triggered by a tag, then running `railway up --service <service-name>` to deploy the app. I do this using the provided `version` script in the `package.json` file.

To deploy, run `npm version patch`.