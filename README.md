# redsee-client

[![Build Status](https://travis-ci.org/confuser/node-redsee-client.png?branch=master)](https://travis-ci.org/confuser/node-redsee-client)
[![Coverage Status](https://coveralls.io/repos/confuser/node-redsee-client/badge.png?branch=master)](https://coveralls.io/r/confuser/node-redsee-client?branch=master)

Client storage/helper functions for implementing a RedSee filter server via [redsee-server](https://github.com/confuser/node-redsee-server)

See [RedSee](https://github.com/Frostcast/RedSee) for an example implementation along with a demo

## Installation
```
npm install redsee-client --save
```

## Usage
```js
var createClient = require('redsee-client')

createClient(opts, function (error, client) {
  console.log(error, client)
})

}

```
