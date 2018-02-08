# new-css-in-js

**THIS IS NOT PRODUCTION READY AT ALL. DO NOT USE IT.**

### Todo

* tests
* actually hydrate scoped rules
* Provider (nonce, theme, container element?)
* babel macro (labels, source maps, hoisting(we can even do it from the css prop since we control the jsx function), precompiling css calls to serialized styles and a hash)
* include styled.tag syntax in default bundle and have a seperate bundle without it and switch to it when using the babel macro (probably have a base package that people don't manually use and a )
* consider making `withComponent` an export instead of a static on components, maybe accept components to styled and use their styles? or something else?

```jsx
// @jsx jsx
import { jsx } from 'new-css-in-js'
// must be react@>=16.3.0
import { render } from 'react-dom'

render(
  <div css={{ color: 'hotpink' }}>This is hotpink</div>,
  document.getElementById('root')
)
```

#### String Styles

```jsx
// @jsx jsx
import { jsx, css } from 'new-css-in-js'
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

#### Keyframes

```jsx
// @jsx jsx
import { css, keyframes, jsx, Style } from 'new-css-in-js'
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

#### Global

> Note: Global styles are removed on unmount

```jsx
// @jsx jsx
import { css, jsx, Global } from 'new-css-in-js'
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

#### Dynamic

The `Dynamic` component does not cache styles, use it for animations and other things that change very quickly.

```jsx
// @jsx jsx
import { css, jsx, Global } from 'new-css-in-js'
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

```jsx
// @jsx jsx
import { jsx, styled } from 'new-css-in-js'
// must be react@>=16.3.0
import { render } from 'react-dom'

const Container = styled.div`
  color: hotpink;
`

render(<Container>This is hotpink</Container>, document.getElementById('root'))
```

### Theming

> Note: This is not fully implemented yet

#### With the css prop

```jsx
// @jsx jsx
import { css, jsx } from 'new-css-in-js'
import { render } from 'react-dom'

render(
  <Provider theme={{ primary: 'hotpink' }}>
    <div
      css={theme => {
        color: theme.primary
      }}
    />
  </Provider>,
  document.getElementById('root')
)
```

#### With styled

```jsx
// @jsx jsx
import { css, jsx } from 'new-css-in-js'
import { render } from 'react-dom'

render(
  <Provider theme={{ primary: 'hotpink' }}>
    <div
      css={theme => {
        color: theme.primary
      }}
    />
  </Provider>,
  document.getElementById('root')
)
```

# Credit

new-css-in-js was heavily inspired by [glam](https://github.com/threepointone/glam).
