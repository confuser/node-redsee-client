var fs = require('fs')
  , async = require('async')
  , arrayClient = require('./lib/array-client')
  , mapClient = require('./lib/map-client')

module.exports = function (opts, callback) {
  var types =
    { whitelist:
      { words: arrayClient
      , emails: arrayClient
      , phrases: arrayClient
      , urls: arrayClient
      }
    , blacklist:
      { words: arrayClient
      , ascii: arrayClient
      , phrases: arrayClient
      , phonetics: mapClient
      , wordsBypass: mapClient
      }
    }
    , client = { whitelist: {}, blacklist: {} }

  async.parallel(
    [ function (cb) {
        async.each(Object.keys(types.whitelist), clientIterator('whitelist'), cb)
      }
    , function (cb) {
        async.each(Object.keys(types.blacklist), clientIterator('blacklist'), cb)
      }
    ], function (error) {
      if (error) return callback(error)

      callback(null, client)
    })

  function clientIterator(listType) {
    return function (type, eachCb) {
      var options

      if (opts && opts[listType]) options = opts[listType][type]

      if (!options) {
        client[listType][type] = types[listType][type]()
        return eachCb()
      }

      if (Array.isArray(options.data)) {
        var fn = client[listType][type] = types[listType][type](options.data)

        // Do nothing on memory updates
        fn.update = function (data, cb) { if (cb) cb() }

        return eachCb()
      }

      // File, could use require, however would block, and would only work if .json
      fs.readFile(options.data, 'utf8', function (error, data) {
        if (error) return eachCb(error)

        var fn

        try {
          fn = client[listType][type] = types[listType][type](JSON.parse(data))
        } catch (e) {
          return eachCb(e)
        }

        // Resave file on update
        fn.update = function (data, cb) {
          if (!cb) cb = function () {}
          var output = data

          if (data instanceof Map) {
            output = []

            data.forEach(function (value, key) {
              output.push([ key, value ])
            })
          } else if (data instanceof Set) {
            output = Array.from(data)
          }

          fs.writeFile(options.data, JSON.stringify(output), 'utf8', cb)
        }

        eachCb()
      })
    }
  }
}
