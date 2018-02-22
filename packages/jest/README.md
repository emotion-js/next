# @emotion/jest

> Testing utils for @emotion and jest

@emotion/jest provides a jest serializer that ~~removes hashes from emotion classes~~(todo) and formats the css in emotion style elements

## Install

```bash
yarn add --dev @emotion/jest
```

## Getting started

```jsx
// @jsx jsx
import jsx from '@emotion/jsx'
import renderer from 'react-test-renderer'
import { serializer } from '@emotion/jest'

expect.addSnapshotSerializer(serializer)

test('style renders correctly', () => {
  expect(
    renderer
      .create(
        <div>
          <div css={{ color: 'hotpink' }}>Some hotpink text</div>
        </div>
      )
      .toJSON()
  ).toMatchSnapshot()
})
```
