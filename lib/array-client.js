var _ = require('highland')

module.exports = function (list) {
  var set = new Set(list || [])
    , client =
    { add: function (str, cb) {
        set.add(str)

        cb(null, set)
      }

    , bulkAdd: function (strs, cb) {
        strs.forEach(function (str) {
          set.add(str)
        })

        cb(null, set)
      }

    , remove: function (str, cb) {
        set.delete(str)

        cb(null, set)
      }

    , bulkRemove: function (strs, cb) {
        // TODO Optimise
        strs.forEach(function (str) {
          set.delete(str)
        })

        cb(null, set)
      }

    , contains: function (str, cb) {
        cb(null, set.has(str))
      }

    , stream: function (opts) {
        var count = 100

        if (opts) count = opts.count

        return _(set).batch(count)
      }

    }

  return client
}
