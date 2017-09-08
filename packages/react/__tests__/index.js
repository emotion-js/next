import React from 'react'
import serializer from 'jest-glamor-react'
import { css, sheet } from 'new-css-in-js'
import styled from 'react-new-css-in-js'
import { render, mount } from 'enzyme'

expect.addSnapshotSerializer(serializer(sheet))

describe('styled', () => {
  test('no dynamic', () => {
    const H1 = styled('h1')`float: left;`

    const tree = render(<H1>hello world</H1>)

    expect(tree).toMatchSnapshot()
  })

  test('basic render', () => {
    const fontSize = 20
    const H1 = styled('h1')`
      color: blue;
      font-size: ${fontSize};
      @media (min-width: 420px) {
        color: blue;
        @media (min-width: 520px) {
          color: green;
        }
      }
    `

    const tree = render(<H1>hello world</H1>)

    expect(tree).toMatchSnapshot()
  })

  test('nested', () => {
    const fontSize = '20px'
    const H1 = styled('h1')`font-size: ${fontSize};`

    const Thing = styled('div')`
      display: flex;
      & div {
        color: green;

        & span {
          color: red;
        }
      }
    `

    const tree = render(
      <Thing>
        hello <H1>This will be green</H1> world
      </Thing>
    )

    expect(tree).toMatchSnapshot()
  })

  test.skip('random expressions', () => {
    const margin = (t, r, b, l) => {
      return props => css`
        margin-top: ${t};
        margin-right: ${r};
        margin-bottom: ${b};
        margin-left: ${l};
      `
    }

    const mq = css`
      @media (min-width: 420px) {
        color: blue;
        @media (min-width: 520px) {
          color: green;
        }
      }
    `

    const H1 = styled('h1')`
      ${mq};
      ${props => props.prop && css`font-size: 1rem;`};
      ${margin(0, 'auto', 0, 'auto')};
      color: green;
    `

    const tree = render(
      <H1 className={'legacy__class'} prop>
        hello world
      </H1>
    )

    expect(tree).toMatchSnapshot()
  })

  test('random expressions undefined return', () => {
    const H1 = styled('h1')`
      ${props => props.prop && css`font-size: 1rem;`};
      color: green;
    `

    const tree = render(<H1 className={'legacy__class'}>hello world</H1>)

    expect(tree).toMatchSnapshot()
  })

  test('random object expression', () => {
    const margin = (t, r, b, l) => {
      return props => ({
        marginTop: t,
        marginRight: r,
        marginBottom: b,
        marginLeft: l
      })
    }
    const H1 = styled('h1')`
      background-color: hotpink;
      ${props => props.prop && { fontSize: '1rem' }};
      ${margin(0, 'auto', 0, 'auto')};
      color: green;
    `

    const tree = render(
      <H1 className={'legacy__class'} prop>
        hello world
      </H1>
    )

    expect(tree).toMatchSnapshot()
  })

  test('composition', () => {
    const fontSize = 20
    const H1 = styled('h1')`font-size: ${fontSize + 'px'};`

    const H2 = styled(H1)`font-size: ${fontSize * 2 / 3};`

    const tree = render(<H2 className={'legacy__class'}>hello world</H2>)

    expect(tree).toMatchSnapshot()
  })

  test('input placeholder', () => {
    const Input = styled('input')`
      ::placeholder {
        background-color: green;
      }
    `
    const tree = render(<Input />)

    expect(tree).toMatchSnapshot()
  })

  test('handles more than 10 dynamic properties', () => {
    const H1 = styled('h1')`
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
      border-left: ${p => p.theme.blue};
    `

    const tree = render(
      <H1 className={'legacy__class'} theme={{ blue: 'blue' }}>
        hello world
      </H1>
    )

    expect(tree).toMatchSnapshot()
  })

  test('function in expression', () => {
    const fontSize = 20
    const H1 = styled('h1')`font-size: ${fontSize + 'px'};`

    const H2 = styled(H1)`font-size: ${({ scale }) => fontSize * scale + 'px'};`

    const tree = render(
      <H2 scale={2} className={'legacy__class'}>
        hello world
      </H2>
    )

    expect(tree).toMatchSnapshot()
  })

  test('innerRef', () => {
    const H1 = styled('h1')`font-size: 12px;`

    const refFunction = jest.fn()

    const tree = mount(<H1 innerRef={refFunction}>hello world</H1>)

    expect(tree).toMatchSnapshot()
    expect(refFunction).toBeCalled()
  })

  test('composing components', () => {
    const Button = styled('button')`color: green;`
    const OtherButton = styled(Button)`display: none;`

    const AnotherButton = styled(OtherButton)`
      display: flex;
      justify-content: center;
    `
    const tree = render(<AnotherButton>hello world</AnotherButton>)

    expect(tree).toMatchSnapshot()
  })

  test('prop filtering', () => {
    const Link = styled('a')`color: green;`
    const rest = { m: [3], pt: [4] }

    const tree = render(
      <Link
        a
        b
        wow
        prop
        filtering
        is
        cool
        aria-label="some label"
        data-wow="value"
        href="link"
        {...rest}
      >
        hello world
      </Link>
    )

    expect(tree).toMatchSnapshot()
  })
  test('no prop filtering on non string tags', () => {
    const Link = styled(props => <a {...props} />)`color: green;`

    const tree = render(
      <Link
        a
        b
        wow
        prop
        filtering
        is
        cool
        aria-label="some label"
        data-wow="value"
        href="link"
      >
        hello world
      </Link>
    )

    expect(tree).toMatchSnapshot()
  })
  test('prop filtering on composed styled components that are string tags', () => {
    const BaseLink = styled('a')`background-color: hotpink;`
    const Link = styled(BaseLink)`color: green;`

    const tree = render(
      <Link
        a
        b
        wow
        prop
        filtering
        is
        cool
        aria-label="some label"
        data-wow="value"
        href="link"
      >
        hello world
      </Link>
    )

    expect(tree).toMatchSnapshot()
  })
  test('className override with css- className', () => {
    const newColor = css`color: hotpink;`
    const H1 = styled('h1')`color: yellow;`

    const tree = render(<H1 className={newColor}>hello world</H1>)

    expect(tree).toMatchSnapshot()
  })
})
