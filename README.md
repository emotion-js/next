# emotion next

**THIS IS NOT PRODUCTION READY AT ALL. DO NOT USE IT.**

### Todo

* tests
* actually hydrate scoped rules
* Provider (nonce, ~~theme~~(done), container element?)
* babel macro (labels, source maps, hoisting(we can even do it from the css prop since we control the jsx function), precompiling css calls to serialized styles and a hash)
* consider making `withComponent` an export instead of a static on components, maybe accept components to styled and use their styles? or something else?
* make the jest serializer a package and remove hashes from snapshots

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

#### Global

> Note: Global styles are removed on unmount

```
yarn add @emotion/global
```

```jsx
/** @jsx jsx */
import jsx from '@emotion/jsx'
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

#### Dynamic

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
/** @jsx jsx */
import jsx from '@emotion/jsx'
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
/** @jsx jsx */
import jsx from '@emotion/jsx'
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

# Credit

emotion next was heavily inspired by [glam](https://github.com/threepointone/glam).
