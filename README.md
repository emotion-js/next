# new-css-in-js

**THIS IS NOT PRODUCTION READY AT ALL. DO NOT USE IT.**

### Todo

* tests
* actually hydrate scoped rules
* Provider
* babel macro

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
