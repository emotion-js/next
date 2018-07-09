// @flow
/** @jsx jsx */
import { Component } from 'react'
import { jsx } from '@emotion/core'
import { Global } from '@emotion/core'
import styled from '@emotion/styled'

let SomeComponent = styled.p`
  color: hotpink;
`

export default class GlobalTest extends Component<
  {},
  { itShouldNotBeThisColor: string }
> {
  state = {
    itShouldNotBeThisColor: 'green',
    shouldChangeKey: false
  }
  render() {
    return (
      <div id="root">
        <Global
          key={
            this.state.shouldChangeKey ? this.state.itShouldNotBeThisColor : 1
          }
          styles={{
            '.some-class': {
              // $FlowFixMe
              color: CSS.escape(this.state.itShouldNotBeThisColor)
            }
          }}
        />
        {/* this should be hotpink */}
        <SomeComponent id="text" className="some-class">
          some text
        </SomeComponent>
        <p>
          The text above should always be hotpink and not the color in the input
          below
        </p>
        <input
          onChange={e => {
            this.setState({ itShouldNotBeThisColor: e.target.value })
          }}
          value={this.state.itShouldNotBeThisColor}
        />
        <br />
        <input type="checkbox" id="key-change-checkbox" />
        <label htmlFor="key-change-checkbox">
          Change Global key on each change
        </label>
      </div>
    )
  }
}
