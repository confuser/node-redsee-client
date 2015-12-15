var assert = require('assert')
  , createClient = require('../lib/map-client')

describe('Map Client', function () {

  describe('#constructor', function () {

    it('should handle no options', function () {
      createClient(null)
    })

    it('should accept data as an object', function () {
      var list = { hello: 'i', am: 'foo', bar: null }

      createClient(list)
    })

    it('should accept data as an array', function () {
      var list =
      [ [ 'hello', 'i' ], [ 'am', 'foo' ], [ 'bar', null ] ]

      createClient(list)
    })

  })

  describe('#add', function () {

    it('should add an element', function (done) {
      var list = { hello: 'i', am: 'foo', bar: null }
        , client = createClient(list)

      client.add({ woo: 'hullo' }, function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set.keys()), [ 'hello', 'am', 'bar', 'woo' ])

        done()
      })
    })

  })

  describe('#bulkAdd', function () {

    it('should add multiple elements', function (done) {
      var list = [ ]
        , client = createClient(list)

      client.bulkAdd({ hello: 'i', am: 'foo', bar: null }, function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set.keys()), [ 'hello', 'am', 'bar' ])

        done()
      })
    })

  })

  describe('#remove', function () {

    it('should remove an element', function (done) {
      var list = { hello: 'i', am: 'foo', bar: null }
        , client = createClient(list)

      client.remove('am', function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set.keys()), [ 'hello', 'bar' ])

        done()
      })
    })

  })

  describe('#bulkRemove', function () {

    it('should remove elements', function (done) {
      var list = { hello: 'i', am: 'foo', bar: null }
        , client = createClient(list)

      client.bulkRemove([ 'i', 'am', 'bar' ], function (error, set) {
        if (error) return done(error)

        assert.deepEqual(Array.from(set.keys()), [ 'hello' ])

        done()
      })
    })

  })

  describe('#contains', function () {

    it('should find elements', function (done) {
      var list = { hello: 'i', am: 'foo', bar: null }
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

  describe('#get', function () {

    it('should get a value', function (done) {
      var list = { hello: 'i', am: 'foo', bar: null }
        , client = createClient(list)

      client.get('hello', function (error, value) {
        if (error) return done(error)

        assert.equal(value, 'i')

        done()
      })
    })

    it('should get multiple values', function (done) {
      var list = { hello: 'i', am: 'foo', bar: null }
        , client = createClient(list)

      client.get([ 'hello', 'am' ], function (error, values) {
        if (error) return done(error)

        assert.deepEqual(values, [ 'i', 'foo' ])

        done()
      })
    })

  })

})
