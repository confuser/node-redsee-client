var assert = require('assert')
  , createClient = require('../')

describe('Client', function () {

  describe('#constructor', function () {

    it('should handle no options', function (done) {
      createClient(null, done)
    })

    it('should handle data as arrays', function (done) {
      var options =
        { whitelist:
          { words:
            { data: [ 'hello', 'i', 'am', 'foo', 'bar' ]
            }
          }
        }

      createClient(options, function (error, client) {
        if (error) return done(error)

        client.whitelist.words.remove('world', function (error, data) {
          if (error) return done(error)

          assert.deepEqual(Array.from(data), options.whitelist.words.data)

          done()
        })
      })
    })

    it('should attach a no-op update function for arrays', function (done) {
      var options =
        { whitelist:
          { words:
            { data: [ 'hello', 'i', 'am', 'foo', 'bar' ]
            }
          }
        }

      createClient(options, function (error, client) {
        if (error) return done(error)

        assert.equal(typeof client.whitelist.words.update, 'function')

        client.whitelist.words.update(null, done)
      })
    })

    it('should handle data as file paths', function (done) {
      var options =
        { whitelist:
          { words:
            { data: './test/fixtures/whitelist-words.json'
            }
          }
        }

      createClient(options, function (error, client) {
        if (error) return done(error)

        client.whitelist.words.remove('world', function (error, data) {
          if (error) return done(error)

          assert.deepEqual(Array.from(data), [ 'hello', 'i', 'am', 'foo', 'bar' ])

          done()
        })
      })
    })

    it('should handle missing files', function (done) {
      var options =
        { whitelist:
          { words:
            { data: './test/fixtures/no-exist.json'
            }
          }
        }

      createClient(options, function (error) {
        assert.equal(error.code, 'ENOENT')

        done()
      })
    })

    it('should handle invalid JSON in files', function (done) {
      var options =
        { whitelist:
          { words:
            { data: './test/fixtures/invalid.json'
            }
          }
        }

      createClient(options, function (error) {
        assert.equal(error.name, 'SyntaxError')

        done()
      })
    })

    it('should attach an update function for files', function (done) {
      var options =
        { whitelist:
          { words:
            { data: './test/fixtures/whitelist-words.json'
            }
          }
        }

      createClient(options, function (error, client) {
        if (error) return done(error)

        assert.equal(typeof client.whitelist.words.update, 'function')

        client.whitelist.words.update([ 'hello', 'i', 'am', 'foo', 'bar' ], done)
      })
    })

  })

})
