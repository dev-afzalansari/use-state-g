import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import createHook from '../createHook'

let useStateG = createHook()

beforeEach(() => {
  useStateG = createHook()
})

test('inits the state and returns that state', async () => {
  function Component() {
    let [count] = useStateG('@count', 0)
    let [title] = useStateG('@title', 'nothing')
    let [user] = useStateG('@user', { name: 'no one', age: 22 })
    let [skills] = useStateG('@skills', ['foo', 'bar'])

    return (
      <div>
        <h1>{count}</h1>
        <h1>{title}</h1>
        <h1>{user.name}</h1>
        <h1>{user.age}</h1>
        <h1>{skills[0]}</h1>
        <h1>{skills[1]}</h1>
      </div>
    )
  }

  let { findByText } = render(<Component />)

  await findByText('0')
  await findByText('nothing')
  await findByText('no one')
  await findByText('22')
  await findByText('foo')
  await findByText('bar')
})

test('setter updates the state', async () => {
  function Component() {
    let [count, setCount] = useStateG('@count', 0)
    let [title, setTitle] = useStateG('@title', 'nothing')
    let [user, setUser] = useStateG('@user', { name: 'no one', age: 22 })
    let [skills, setSkills] = useStateG('@skills', ['foo', 'bar'])

    return (
      <div>
        <h1>{count}</h1>
        <h1>{title}</h1>
        <h1>{user.name}</h1>
        <h1>{user.age}</h1>
        <h1>{skills[0]}</h1>
        <h1>{skills[1]}</h1>
        <button
          onClick={() => {
            setCount(count + 1)
          }}
        >
          count
        </button>
        <button
          onClick={() => {
            setTitle('something')
          }}
        >
          title
        </button>
        <button
          onClick={() => {
            setUser((user: any) => ({...user, name: 'someone'}))
          }}
        >
          user
        </button>
        <button
          onClick={() => {
            setSkills((skills: any) => {
              let arr = [...skills]
              arr[0] = 'foo skills'
              return arr
            })
          }}
        >
          skills
        </button>
      </div>
    )
  }

  let { findByText, getByText } = render(<Component />)

  await findByText('0')
  await findByText('nothing')
  await findByText('no one')
  await findByText('22')
  await findByText('foo')
  await findByText('bar')

  fireEvent.click(getByText('count'))
  fireEvent.click(getByText('title'))
  fireEvent.click(getByText('user'))
  fireEvent.click(getByText('skills'))

  await findByText('1')
  await findByText('something')
  await findByText('someone')
  await findByText('22')
  await findByText('foo skills')
  await findByText('bar')
})

test('init method inits the state', async () => {
  function Component() {
    let [count] = useStateG('@count')
    let [title] = useStateG('@title')
    let [user] = useStateG('@user')
    let [skills] = useStateG('@skills')

    return (
      <div>
        <h1>{count}</h1>
        <h1>{title}</h1>
        <h1>{user.name}</h1>
        <h1>{user.age}</h1>
        <h1>{skills[0]}</h1>
        <h1>{skills[1]}</h1>
      </div>
    )
  }

  function Wrapper({ children }: { children: React.ReactNode}) {
    useStateG.init('@count', 0)
    useStateG.init('@title', 'nothing')
    useStateG.init('@user', { name: 'no one', age: 22 })
    useStateG.init('@skills', ['foo', 'bar'])

    return <div>{children}</div>
  }

  let { findByText } = render(
    <Wrapper>
      <Component />
    </Wrapper>
  )

  await findByText('0')
  await findByText('nothing')
  await findByText('no one')
  await findByText('22')
  await findByText('foo')
  await findByText('bar')
})

test('setter method updates the state', async () => {
  function Component() {
    let [count] = useStateG('@count', 0)
    let [title] = useStateG('@title', 'nothing')
    let [user] = useStateG('@user', { name: 'no one', age: 22 })
    let [skills] = useStateG('@skills', ['foo', 'bar'])

    return (
      <div>
        <h1>{count}</h1>
        <h1>{title}</h1>
        <h1>{user.name}</h1>
        <h1>{user.age}</h1>
        <h1>{skills[0]}</h1>
        <h1>{skills[1]}</h1>
      </div>
    )
  }

  function Control() {
    let setCount = useStateG.setter('@count')
    let setTitle = useStateG.setter('@title')
    let setUser = useStateG.setter('@user')
    let setSkills = useStateG.setter('@skills')

    return (
      <div>
        <button
          onClick={() => {
            setCount((count: number) => count + 1)
          }}
        >
          count
        </button>
        <button
          onClick={() => {
            setTitle('something')
          }}
        >
          title
        </button>
        <button
          onClick={() => {
            setUser((user: any) => ({...user, name:'someone'}))
          }}
        >
          user
        </button>
        <button
          onClick={() => {
            setSkills((skills: any) => {
              let arr = [...skills]
              arr[0] = 'foo skills'
              return arr
            })
          }}
        >
          skills
        </button>
      </div>
    )
  }

  let { findByText, getByText } = render(
    <div>
      <Component />
      <Control />
    </div>
  )

  await findByText('0')
  await findByText('nothing')
  await findByText('no one')
  await findByText('22')
  await findByText('foo')
  await findByText('bar')

  fireEvent.click(getByText('count'))
  fireEvent.click(getByText('title'))
  fireEvent.click(getByText('user'))
  fireEvent.click(getByText('skills'))

  await findByText('1')
  await findByText('something')
  await findByText('someone')
  await findByText('22')
  await findByText('foo skills')
  await findByText('bar')
})

test('updates the subscribed components only', async () => {
  function Count() {
    let [count] = useStateG('@count', 0)
    let rendered = React.useRef(0)
    rendered.current++

    return (
      <div>
        <h1>count: {count}</h1>
        <h1>CountRendered: {rendered.current}</h1>
      </div>
    )
  }

  function Title() {
    let [title] = useStateG('@title', 'nothing')
    let rendered = React.useRef(0)
    rendered.current++

    return (
      <div>
        <h1>count: {title}</h1>
        <h1>TitleRendered: {rendered.current}</h1>
      </div>
    )
  }

  function Control() {
    let setCount = useStateG.setter('@count')
    let setTitle = useStateG.setter('@title')
    let rendered = React.useRef(0)
    rendered.current++

    return (
      <div>
        <button onClick={() => setCount((c: number) => c + 1)}>inc</button>
        <button onClick={() => setCount((c: number) => c - 1)}>dec</button>
        <button onClick={() => setTitle('something')}>change</button>
        <h1>ControlRendered: {rendered.current}</h1>
      </div>
    )
  }

  let { findByText, getByText } = render(
    <div>
      <Count />
      <Title />
      <Control />
    </div>
  )

  await findByText('CountRendered: 1')
  await findByText('TitleRendered: 1')
  await findByText('ControlRendered: 1')

  fireEvent.click(getByText('inc'))

  await findByText('CountRendered: 2')
  await findByText('TitleRendered: 1')
  await findByText('ControlRendered: 1')

  fireEvent.click(getByText('change'))

  await findByText('CountRendered: 2')
  await findByText('TitleRendered: 2')
  await findByText('ControlRendered: 1')

  fireEvent.click(getByText('dec'))

  await findByText('CountRendered: 3')
  await findByText('TitleRendered: 2')
  await findByText('ControlRendered: 1')
})

test('throws an error if no key passed to the hook', () => {
  expect.assertions(1)

  try {
    function Component() {
      // @ts-expect-error
      let [count] = useStateG()

      return <h1>foo</h1>
    }
    render(<Component />)
  } catch (err: any) {
    expect(err.message).toBe(
      '[use-state-g] you must pass a key to retreive state and setter'
    )
  }
})

test('throws an error if no key or value passed to the init method', () => {
  expect.assertions(2)

  try {
    // @ts-expect-error
    useStateG.init()
  } catch (err: any) {
    expect(err.message).toBe(
      '[use-state-g] you must pass a key and corresponding value to the init method'
    )
  }

  try {
    // @ts-expect-error
    useStateG.init('@key')
  } catch (err: any) {
    expect(err.message).toBe(
      '[use-state-g] you must pass a key and corresponding value to the init method'
    )
  }
})

test('throws an error if no key passed to the setter method', () => {
  expect.assertions(1)

  try {
    // @ts-expect-error
    useStateG.setter()
  } catch (err: any) {
    expect(err.message).toBe(
      '[use-state-g] you must pass a key to retrieve setter in setter method'
    )
  }
})
