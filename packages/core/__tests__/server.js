/** @jsx jsx
 * @jest-environment node
 */
// @flow
import 'test-utils/no-test-mode'
import * as React from 'react'
import cases from 'jest-in-case'
import { jsx, Global } from '@emotion/core'
import Style from '@emotion/style'
import styled from '@emotion/styled'
import css from '@emotion/css'
import keyframes from '@emotion/keyframes'
import { renderToString } from 'react-dom/server'
import HTMLSerializer from 'jest-serializer-html'

expect.addSnapshotSerializer(HTMLSerializer)

cases(
  'ssr',
  opts => {
    expect(renderToString(opts.render())).toMatchSnapshot()
  },
  {
    basic: {
      render: () => <div css={{ color: 'hotpink' }}>some hotpink text</div>
    },
    global: {
      render: () => (
        <Global
          css={{
            html: {
              backgroundColor: 'hotpink'
            }
          }}
        />
      )
    },
    keyframes: {
      render: () => {
        const animation = keyframes(
          css`
            from {
              color: green;
            }
            to {
              color: blue;
            }
          `
        )

        return (
          <React.Fragment>
            <Style styles={animation} />
            <div css={{ animation: `1s ${animation.toString()}` }} />
          </React.Fragment>
        )
      }
    },
    className: {
      // this API is going to change
      skip: true,
      render: () => {
        const className = css`
          color: hotpink;
        `

        return (
          <div>
            <Style styles={className} />
            <div className={className} />
          </div>
        )
      }
    },
    'only render a style once with the css prop': {
      render: () => {
        return (
          <div css={{ color: 'green' }}>
            <div css={{ color: 'hotpink' }} />
            <div css={{ color: 'hotpink' }} />
          </div>
        )
      }
    },
    'only render a style once with Style': {
      render: () => {
        const animation = keyframes(css`
          from {
            color: green;
          }
          to {
            color: hotpink;
          }
        `)
        return (
          // note that there should be a container element with a style/Provider
          // otherwise the style will render twice
          <div css={{ color: 'green' }}>
            <Style styles={animation} />
            <Style styles={animation} />
            <div css={{ animation: `${animation.name} 1s` }} />
          </div>
        )
      }
    },

    'only render a style once with styled': {
      render: () => {
        const SomeComponent = styled.div`
          color: hotpink;
        `
        return (
          <div css={{ color: 'green' }}>
            <SomeComponent />
            <SomeComponent />
          </div>
        )
      }
    }
  }
)
