# new-css-in-js

**THIS IS NOT PRODUCTION READY AT ALL. DO NOT USE IT.**

### Todo

* tests
* actually hydrate scoped rules
* Provider
* babel macro (labels, source maps, hoisting(we can even do it from the css prop since we control the jsx function), precompiling css calls to serialized styles and a hash)
* Dynamic component that changes a style rule rather than inserting a new one on each change

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

# Credit

new-css-in-js was heavily inspired by [glam](https://github.com/threepointone/glam).
