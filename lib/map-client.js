module.exports = function (list) {
  var map = new Map()

  if (list) {
    if (Array.isArray(list)) {
      list.forEach(function (item) {
        map.set(item[0], item[1])
      })

    } else {
      Object.keys(list).forEach(function (key) {
        map.set(key, list[key])
      })
    }
  }

  var client =
    { add: function (obj, cb) {
        client.bulkAdd(obj, cb)
      }

    , bulkAdd: function (obj, cb) {
        // Should this be another map rather than standard object?
        Object.keys(obj).forEach(function (key) {
          map.set(key, obj[key])
        })

        cb(null, map)
      }

    , remove: function (str, cb) {
        map.delete(str)

        cb(null, map)
      }

    , bulkRemove: function (keys, cb) {
        keys.forEach(function (key) {
          map.delete(key)
        })

        cb(null, map)
      }

    , contains: function (key, cb) {
        cb(null, map.has(key))
      }

    , get: function (key, cb) {
        if (!Array.isArray(key)) return cb(null, map.get(key))

        var found = []

        key.forEach(function (key) {
          if (map.has(key)) found.push(map.get(key))
        })

        cb(null, found)
      }

    }

  return client
}
