# new-css-in-js

**THIS IS NOT PRODUCTION READY AT ALL. DO NOT USE IT.**

### Todo

* tests
* actually hydrate scoped rules
* Provider
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

# Credit

new-css-in-js was heavily inspired by [glam](https://github.com/threepointone/glam).
