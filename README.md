# emotion next

> An experimental css-in-js library built for React

**This is pretty experimental and there will be breaking changes often. Don't use it for anything really important yet.**

### Todo

* Provider (nonce, ~~theme~~(done), container element?)
* add source maps

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
* Styles won't be cached in SSR if two elements have the same style and they have no common ancestor with styles from emotion or a Provider
* It requires every style to be rendered in the react tree
* It doesn't support component selectors and might never or it might, idk
* It renders style elements next to the elements that are being styled in SSR so using pseudo-classes like `:first-child` and `:nth-child` is unsafe and pseudo-classes like `:first-of-type` and `:nth-of-type` should be used instead

#### Getting Started

```bash
yarn add @emotion/core
```

```jsx
/** @jsx jsx */
import { jsx } from '@emotion/core'
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
import { css } from '@emotion/core'
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

```jsx
import * as React from 'react'
import { Global } from '@emotion/core'
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
yarn add @emotion/keyframes
```

```jsx
/** @jsx jsx */
import { jsx } from '@emotion/core'
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
    <div
      css={css`
        animation: ${animation.name} infinite 20s linear;
        ${animation.styles};
      `}
    >
      This is getting rotated
    </div>
  </div>,
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
import { jsx } from '@emotion/core'
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
  color: ${props => props.theme.primary};
`

render(
  <Provider theme={{ primary: 'hotpink' }}>
    <SomeComponent />
  </Provider>,
  document.getElementById('root')
)
```

# Credit

emotion next was heavily inspired by [glam](https://github.com/threepointone/glam).
