# sample-apps

Official sample apps for [astra-mongoose](https://npmjs.com/package/@datastax/astra-mongoose).

## Getting Started

Each directory contains an isolated sample Node.js application.
The following is a list of available sample apps.

* [netlify-functions-ecommerce](netlify-functions-ecommerce)
* [discord-bot](discord-bot)
* [typescript-express-reviews](typescript-express-reviews)
* [photography-site-demo](photography-site-demo.js)

## Prerequisites

In order to run these demos, you'll need to have [Node.js](https://nodejs.org) 20.6.0 or higher installed.

You'll also need to run a copy of the Stargate infrastructure stack including the Data API.
The simplest way to do this is by using the script found under the [bin](bin) directory
to start the stack with [Docker](https://docker.com):

```
cd stargate-mongoose-sample-apps
bin/start_data_api.sh
```
