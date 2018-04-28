// @flow
import createCache from '@emotion/cache'

let createCompatCache = (emotion: *) => {
  let cache = createCache(emotion.sheet.opts)
  cache.inserted = emotion.caches.inserted
  cache.registered = emotion.caches.registered
  cache.compat = true
  return cache
}

export default createCompatCache
