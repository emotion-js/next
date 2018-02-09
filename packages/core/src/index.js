// @flow
import { isBrowser } from '@emotion/utils'
import * as React from 'react'
import type { CSSContextType } from '@emotion/types'
import StyleSheet from '@emotion/sheet'
import { Stylis } from 'emotion-utils'
import stylisRuleSheet from './rule-sheet'

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

if (process.env.NODE_ENV === 'test') {
  // $FlowFixMe
  Object.defineProperty(hydration, 'shouldHydrate', {
    set: () => {},
    get: () => true
  })
}

const defaultContext: CSSContextType = {
  stylis: new Stylis({
    keyframe: false,
    global: false,
    semicolon: true
  }),
  sheet: new StyleSheet({ key: '' }),
  inserted: {},
  registered: {},
  theme: {}
}

if (isBrowser) {
  defaultContext.sheet.inject()
}

let current

const insertionPlugin = stylisRuleSheet(function(rule: string) {
  current.push(rule)
})

const returnFullPlugin = function(context) {
  if (context === -1) {
    current = []
  }
  if (context === -2) {
    return current
  }
}

defaultContext.stylis.use(insertionPlugin)(returnFullPlugin)

// $FlowFixMe
export const CSSContext: Context<CSSContextType> = React.createContext(
  defaultContext
)
