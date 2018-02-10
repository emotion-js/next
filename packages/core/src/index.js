// @flow
import { isBrowser } from '@emotion/utils'
import * as React from 'react'
import type { CSSContextType } from '@emotion/types'
import createCache from '@emotion/cache'

type RenderFn<T> = (value: T) => React.Node

export type ProviderProps<T> = {
  value: T,
  children?: React.Node
}

export type ConsumerProps<T> = {
  children: RenderFn<T> | [RenderFn<T>]
}

export type ConsumerState<T> = {
  value: T
}

export type Provider<T> = React.Component<ProviderProps<T>>
export type Consumer<T> = React.Component<ConsumerProps<T>, ConsumerState<T>>

export type Context<T> = {
  Provider: Class<Provider<T>>,
  Consumer: Class<Consumer<T>>
}

export let hydration = { shouldHydrate: false }

if (isBrowser) {
  hydration.shouldHydrate = !!document.querySelector('[data-more]')
}

declare var __TEST__: boolean

if (__TEST__) {
  // $FlowFixMe
  Object.defineProperty(hydration, 'shouldHydrate', {
    set: () => {},
    get: () => true
  })
}

// $FlowFixMe
export const CSSContext: Context<CSSContextType> = React.createContext(null)

export function consumer(func: CSSContextType => React.Node) {
  return (
    <CSSContext.Consumer>
      {context => {
        if (context === null) {
          const instance = createCache()
          return (
            <CSSContext.Provider value={instance}>
              {func(instance)}
            </CSSContext.Provider>
          )
        } else {
          return func(context)
        }
      }}
    </CSSContext.Consumer>
  )
}
