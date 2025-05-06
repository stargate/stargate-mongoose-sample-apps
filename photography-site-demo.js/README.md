

# photography-site

This sample app demonstrates a photography site by using [`express`](https://www.npmjs.com/package/express), [`mongoose`](https://www.npmjs.com/package/mongoose) and [`astra-mongoose`](https://www.npmjs.com/package/@datastax/astra-mongoose).

## Environment

### cassandra backend
Make sure you have Cassandra support

> If want to run cassandra locally, you need to have a local Stargate instance(DSE-Next) and Data API running as described on  the [main page](../README.md) of this repo.
>
> If want to run against AstraDB, please go to [AstraDB](https://dev.cloud.datastax.com/) create your database and keyspace 'photography' .


### node
Make sure you have Node.js 20.6.0 or higher



## .env

### Setting up .env file to run against AstraDB
1. Copy the `.env.example` file to `.env` and fill in the values for the environment variables.
2. Set `IS_ASTRA` to `true`
3. Set `NOMIC_API_KEY` to your Nomic api key
4. Set `ASTRA_API_ENDPOINT` to your AstraDB database endpoint
5. Set `ASTRA_NAMESPACE` to your AstraDB database keyspace
6. Set `ASTRA_APPLICATION_TOKEN` to your AstraDB application token

### Setting up .env file to run against self-hosted DB
1. Copy the `.env.example` file to `.env` and fill in the values for the environment variables.
2. Set `IS_ASTRA` to `false`
3. Set `NOMIC_API_KEY` to your Nomic api key
4. Set `DATA_API_URL` to `http://127.0.0.1:8181/v1/photography`
5. Set `DATA_API_AUTH_USERNAME` to `cassandra`
6. Set `DATA_API_AUTH_PASSWORD` to `cassandra`




## Running This Sample
1. Run `npm install`
2. Run `npm run seed`
3. Run `npm start`
4. Visit `http://127.0.0.1:3000` to see the UI
