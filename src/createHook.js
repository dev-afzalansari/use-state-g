import { create } from 'react-tivity'

export default function createHook() {
  const useStore = create({})
  const env = process.env.NODE_ENV
  const state = useStore.state

  // setter returns a setState fn for passed key
  const setter = sliceKey => {
    if (typeof sliceKey === 'undefined' && env !== 'production')
      throw new Error(
        '[use-state-g] you must pass a key retrieve setter in setter method'
      )

    const setState = nextState => {
      let newState =
        typeof nextState === 'function'
          ? nextState(state.get(sliceKey))
          : nextState
      let obj = {}
      obj[sliceKey] = newState
      state.set(obj)
    }

    return setState
  }

  // to set the initial state without causing an update
  const init = (key, value) => {
    if (
      typeof key === 'undefined' ||
      (typeof value === 'undefined' && env !== 'production')
    )
      throw new Error(
        '[use-state-g] you must pass a key and corresponding value to the init method'
      )

    const slice = state.get(key)
    if (!slice && typeof value !== 'undefined') {
      let obj = {}
      obj[key] = value
      /*
      react-tivity's set method's second argument defaults to true 
      when false it only changes the state without causing an update
      to the subscribed components and is only needed if you wanna solve
      this setstate-in-render problem basically when you try to update a
      component while rendering another component react throws this error
      https://github.com/facebook/react/issues/18178. To solve the problem
      of setting the initial state while rendering parent component this 
      trick solves the issue.
      */
      state.set(obj, false)
    }
  }

  // hook
  const useState = (key, value) => {
    if (!key && env !== 'production')
      throw new Error(
        '[use-state-g] you must pass a key to retreive state and setter'
      )

    const slice = state.get(key)

    if (!slice && typeof value !== 'undefined') init(key, value)

    useStore(s => s[key])

    return [state.get(key), setter(key)]
  }

  Object.assign(useState, {
    setter,
    init
  })

  return useState
}
