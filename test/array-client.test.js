var assert = require('assert')
  , createClient = require('../lib/array-client')

describe('Array Client', function () {

  describe('#constructor', function () {

    it('should handle no options', function () {
      createClient(null)
    })

    it('should accept data as an array', function () {
      var list = [ 'hello', 'i', 'am', 'foo', 'bar' ]

      createClient(list)
    })

  })

  describe('#add', function () {

    it('should add an element', function (done) {
      var list = [ 'hello', 'i', 'am', 'foo', 'bar' ]
        , client = createClient(list)

      client.add('woo', function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set), [ 'hello', 'i', 'am', 'foo', 'bar', 'woo' ])

        done()
      })
    })

  })

  describe('#bulkAdd', function () {

    it('should add multiple elements', function (done) {
      var list = [ ]
        , client = createClient(list)

      client.bulkAdd([ 'hello', 'i', 'am', 'foo' ], function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set), [ 'hello', 'i', 'am', 'foo' ])

        done()
      })
    })

  })

  describe('#remove', function () {

    it('should remove an element', function (done) {
      var list = [ 'hello', 'i', 'am', 'foo', 'bar' ]
        , client = createClient(list)

      client.remove('am', function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set), [ 'hello', 'i', 'foo', 'bar' ])

        done()
      })
    })

  })

  describe('#bulkRemove', function () {

    it('should remove elements', function (done) {
      var list = [ 'hello', 'i', 'am', 'foo', 'bar' ]
        , client = createClient(list)

      client.bulkRemove([ 'i', 'am', 'foo' ], function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set), [ 'hello', 'bar' ])

        done()
      })
    })

  })

  describe('#contains', function () {

    it('should find elements', function (done) {
      var list = [ 'hello', 'i', 'am', 'foo', 'bar' ]
        , client = createClient(list)

      client.contains('hello', function (error, exists) {
        if (error) return done(error)

        assert.equal(exists, true)

        client.contains('nope', function (error, exists) {
          if (error) return done(error)

          assert.equal(exists, false)

          done()

        })
      })
    })

  })

  describe('#stream', function () {

    it('should expose a stream in batches', function (done) {
      var list = [ 'hello', 'i', 'am', 'foo', 'bar' ]
        , client = createClient(list)

      client.stream({ count: 2 })
        .on('data', function (data) {
          assert(Array.isArray(data))

          data.forEach(function (elem) {
            list.splice(list.indexOf(elem), 1)
          })
        }).on('end', function () {
          assert.equal(list.length, 0)

          done()
        })
    })

    it('should default a stream in batches of 100', function (done) {
      var list = [ 'hello', 'i', 'am', 'foo', 'bar' ]
        , client = createClient(list)

      client.stream()
        .on('data', function (data) {
          assert(Array.isArray(data))
          assert.equal(data.length, 5)

          data.forEach(function (elem) {
            list.splice(list.indexOf(elem), 1)
          })
        }).on('end', function () {
          assert.equal(list.length, 0)

          done()
        })
    })

  })

})
