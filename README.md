# emotion next

> An experimental css-in-js library built for React

**This is pretty experimental and there will be breaking changes often. Don't use it for anything really important yet.**

### Todo

* actually hydrate scoped rules
* Provider (nonce, ~~theme~~(done), container element?)
* babel macro (labels, source maps, hoisting(we can even do it from the css prop since we control the jsx function), precompiling css calls to serialized styles and a hash)

## Why should I use this?

* Server side rendering just works. (just call `react-dom`'s `renderToString` or `renderToNodeStream`)
* You like the css prop.
* You want a flexible css-in-js library.
* It works with string styles.
* It works with object styles.
* It has great composition.
* There's no babel plugin, just babel macros.(i.e. style minification, labels and etc. will work in react-scripts@2)

## Why shouldn't I use this?

* It only works with react@>=16.3.0.
* Don't use it if you're totally fine with the styling solution you're already using
* Styles won't be cached if two elements have the same style and they have no common ancestor with styles from emotion or a Provider
* It requires every style to be rendered in the react tree so it's pretty inconvenient for keyframes
* It assumes that styles rendered on the server will be the same as the styles on the first render on the client
* It doesn't support component selectors and might never or it might, idk

#### Getting Started

```bash
yarn add @emotion/core @emotion/jsx
```

```jsx
/** @jsx jsx */
import jsx from '@emotion/jsx'
// must be react@>=16.3.0
import { render } from 'react-dom'

render(
  <div css={{ color: 'hotpink' }}>This is hotpink</div>,
  document.getElementById('root')
)
```

#### String Styles

```
yarn add @emotion/css
```

```jsx
/** @jsx jsx */
import jsx from '@emotion/jsx'
import css from '@emotion/css'
// must be react@>=16.3.0
import { render } from 'react-dom'

render(
  <div
    css={css`
      color: hotpink;
    `}
  >
    This is hotpink
  </div>,
  document.getElementById('root')
)
```

#### Global

> Note: Global styles are removed on unmount

```
yarn add @emotion/global
```

```jsx
import * as React from 'react'
import Global from '@emotion/global'
import css from '@emotion/css'
import { render } from 'react-dom'

render(
  <Global
    css={[
      css`
        body {
          color: hotpink;
        }
      `,
      {
        html: {
          backgroundColor: 'darkgreen'
        }
      }
    ]}
  />,
  document.getElementById('root')
)
```

#### Keyframes

```
yarn add @emotion/keyframes @emotion/style
```

```jsx
/** @jsx jsx */
import jsx from '@emotion/jsx'
import Style from '@emotion/style'
import css from '@emotion/css'
import keyframes from '@emotion/keyframes'
import { render } from 'react-dom'

const animation = keyframes(css`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`)

render(
  <div>
    <Style styles={animation} />
    <div
      css={css`
        animation: ${animation} infinite 20s linear;
      `}
    >
      This is getting rotated
    </div>
  </div>,
  document.getElementById('root')
)
```

#### Dynamic

> **This isn't totally ready yet, it's API will definitely change, you probably shouldn't use it yet.**

The `Dynamic` component does not cache styles, use it for animations and other things that change very quickly.

```
yarn add @emotion/dynamic
```

```jsx
/** @jsx jsx */
import jsx from '@emotion/jsx'
import Dynamic from '@emotion/dynamic'
import css from '@emotion/css'
import { render } from 'react-dom'

render(
  <Dynamic
    css={{ color: 'hotpink' }}
    render={className => <div className={className} />}
  />,
  document.getElementById('root')
)
```

#### styled

```
yarn add @emotion/styled
```

```jsx
import * as React from 'react'
import styled from '@emotion/styled'
// must be react@>=16.3.0
import { render } from 'react-dom'

const Container = styled.div`
  color: hotpink;
`

render(<Container>This is hotpink</Container>, document.getElementById('root'))
```

### Theming

```
yarn add @emotion/provider
```

#### With the css prop

```jsx
/** @jsx jsx */
import jsx from '@emotion/jsx'
import Provider from '@emotion/provider'
import css from '@emotion/css'
import { render } from 'react-dom'

render(
  <Provider theme={{ primary: 'hotpink' }}>
    <div
      css={theme => ({
        color: theme.primary
      })}
    />
  </Provider>,
  document.getElementById('root')
)
```

#### With styled

```jsx
import * as React from 'react'
import Provider from '@emotion/provider'
import css from '@emotion/css'
import { render } from 'react-dom'

const SomeComponent = styled.div`
  color: ${props.theme.primary};
`

render(
  <Provider theme={{ primary: 'hotpink' }}>
    <SomeComponent />
  </Provider>,
  document.getElementById('root')
)
```

#### Getting a class name outside of render

> **Note:**
>
> Only do this when you absolutely **need** a class name outside of render

```jsx
import * as React from 'react'
import css from '@emotion/css'
import Style from '@emotion/style'

const className = css`
  color: hotpink;
`

render(
  <div>
    {/* The class name has to be rendered with `Style` */}
    <Style styles={className} />
    <div className={className} />
  </div>,
  document.getElementById('root')
)
```

# Credit

emotion next was heavily inspired by [glam](https://github.com/threepointone/glam).
