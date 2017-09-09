import React from 'react'
import { render } from 'enzyme'
import serializer from 'jest-glamor-react'
import { css, sheet } from '../src'

expect.addSnapshotSerializer(serializer(sheet))

describe('css', () => {
  test('float property', () => {
    const cls1 = css`float: left;`

    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })

  test('handles more than 10 dynamic properties', () => {
    const cls1 = css`
      text-decoration: ${'underline'};
      border-right: solid blue 54px;
      background: ${'white'};
      color: ${'black'};
      display: ${'block'};
      border-radius: ${'3px'};
      padding: ${'25px'};
      width: ${'500px'};
      z-index: ${100};
      font-size: ${'18px'};
      text-align: ${'center'};
    `

    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })

  test('random expression', () => {
    const cls1 = css`
      font-size: 20px;
      @media (min-width: 420px) {
        color: blue;
        ${css`
          width: 96px;
          height: 96px;
        `};
        line-height: 40px;
      }
      background: green;
    `
    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })
  test('@supports', () => {
    const cls1 = css`@supports (display: grid) {display: grid;}`
    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })
  test('nested at rules', () => {
    const cls1 = css`
      @supports (display: grid) {
        display: grid;
        @supports (display: flex) {
          display: flex;
        }
      }
      @media (min-width: 420px) {
        color: pink;
        @media (max-width: 500px) {
          color: hotpink;
        }
      }
    `
    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })
  test('nested', () => {
    const cls1 = css`
      color: yellow;
      & .some-class {
        display: flex;
        & .some-other-class {
          background-color: hotpink;
        }
        @media (max-width: 600px) {
          background-color: pink;
        }
      }
      &.another-class {
        display: flex;
      }
    `
    const tree = render(
      <div className={cls1}>
        <div className="some-class">
          <div className="some-other-class" />
        </div>
      </div>
    )
    expect(tree).toMatchSnapshot()
  })
  test('empty rule', () => {
    const cls1 = css``

    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })
  test('css variables', () => {
    const cls1 = css`
      --some-var: 1px;
      width: var(--some-var);
    `
    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })
  test('with object interpolation', () => {
    const cls1 = css`${{ display: 'flex' }};`
    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })
  test('with array interpolation', () => {
    const cls = css`align-items: center;`
    const cls1 = css`${[{ display: 'flex' }, `justify-content: center;`, cls]};`
    const tree = render(<div className={cls1} />)
    expect(tree).toMatchSnapshot()
  })
  test('selectivity when composing', () => {
    const red = css`color: red;`
    const blue = css`color: blue;`
    const green = css`color: green;`

    const final = css`
      ${green};
      ${blue};
      ${red};
    `

    const tree = render(<div className={final} />)
    expect(tree).toMatchSnapshot()
  })
  test('basic function call syntax', () => {
    const cls = css({ color: 'hotpink' })
    const tree = render(<div className={cls} />)
    expect(tree).toMatchSnapshot()
  })
})
