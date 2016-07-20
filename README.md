# node-credstash
[![Circle CI](https://circleci.com/gh/roylines/node-credstash.svg?style=svg)](https://circleci.com/gh/roylines/node-credstash)

Node.js module for reading [credstash](https://github.com/fugue/credstash) secrets without needing snakes

```js
const Credstash = require('credstash'),
      credstash = new Credstash();

credstash.get('secret', { contextkey: 'contextval' })
         .then(secret => /* do something with secret */)
         .catch(err => /* oops! */);
```

## Installation
Ensure you have [AWS credentials configured](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html).
The credentials should be set up as a [secret reader](https://github.com/fugue/credstash#secret-reader)

You must also ensure the environment variable AWS_DEFAULT_REGION is set.

```bash
$ npm install SPSCommerce/credstash
```

## What is credstash?
[Credstash](https://github.com/fugue/credstash) is a little utility for managing credentials in the cloud

## Who this module for?
This module is for environments where you are using [credstash](https://github.com/fugue/credstash) to store secrets,
and you want to read secrets within node without installing python.
The module could be used within your node module to retrieve, for instance, database connection credentials from credstash.

## Retrieving the last N versions of a secret
Credstash support [versioning of secrets](https://github.com/fugue/credstash#versioning-secrets) which allows to easily rotate secrets.

By default node-credstash will return the latest (most recent version of a secret).
You can also retrieve the latest N versions of a secret as follows:

```js
const Credstash = require('credstash'),
      credstash = new Credstash();

credstash.get('secret', { contextkey: 'contextvalue' }, {limit: 3})
         .then(secrets => {
             console.log('this is the last version', secrets[0]);
             console.log('this is the second-last', secrets[1]);
             console.log('this is the third-last', secrets[2]);
         });
```

