// @flow

export default function memoize(fn: string => any) {
  const cache = {}

  return (arg: string) => {
    if (cache[arg] === undefined) cache[arg] = fn(arg)
    return cache[arg]
  }
}
