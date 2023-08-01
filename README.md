# sample-apps

Official sample apps for [stargate-mongoose](https://npmjs.com/package/stargate-mongoose).

## Getting Started

Each directory contains an isolated sample Node.js application.
The following is a list of available sample apps.

* [netlify-functions-ecommerce](netlify-functions-ecommerce)
* [discord-bot](discord-bot)
* [typescript-express-reviews](typescript-express-reviews)

## Prerequisites

In order to run these demos, you'll need to have [Node.js](https://nodejs.org) 14 or higher installed. 

You'll also need to run a copy of the Stargate infrastructure stack including the JSON API. 
The simplest way to do this is by using the script found under the [bin](bin) directory 
to start the stack with [Docker](https://docker.com):

```
cd stargate-mongoose-sample-apps 
bin/start_json_api.sh
```

## Troubleshooting

### running JSON API locally instead of using a container

When you have a node version higher than 17, you'll need to change localhost to 127.0.0.1 to avoid 'connect ECONNREFUSED' issue. More info in [node issue](https://github.com/nodejs/node/issues/47785).

