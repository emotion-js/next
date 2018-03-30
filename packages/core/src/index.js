// @flow
import { isBrowser } from '@emotion/utils'
import * as React from 'react'
import type { CSSContextType } from '@emotion/types'
import createCache from '@emotion/cache'

type RenderFn<T> = (value: T) => React.Node

type ProviderProps<T> = {
  value: T,
  children?: React.Node
}

type ConsumerProps<T> = {
  children: RenderFn<T> | [RenderFn<T>]
}

type ConsumerState<T> = {
  value: T
}

type Provider<T> = React.Component<ProviderProps<T>>
type Consumer<T> = React.Component<ConsumerProps<T>, ConsumerState<T>>

type Context<T> = {
  Provider: Class<Provider<T>>,
  Consumer: Class<Consumer<T>>
}

// $FlowFixMe
export const CSSContext: Context<CSSContextType> = React.createContext(null)

let defaultCache = createCache()

export function consumer(
  instance: { emotionCache?: CSSContextType },
  func: CSSContextType => React.Node
) {
  return (
    <CSSContext.Consumer>
      {context => {
        if (context === null) {
          if (isBrowser && process.env.NODE_ENV !== 'test') {
            return func(defaultCache)
          }
          if (instance.emotionCache === undefined) {
            instance.emotionCache = createCache()
          }
          return (
            <CSSContext.Provider value={instance.emotionCache}>
              {func(instance.emotionCache)}
            </CSSContext.Provider>
          )
        } else {
          return func(context)
        }
      }}
    </CSSContext.Consumer>
  )
}
