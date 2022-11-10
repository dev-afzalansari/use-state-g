import createStore from './store'
import { useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js'

export default function createHook() {
  const store = createStore({})
  const env = process.env.NODE_ENV

  const useStore = (key) => {

    const getSnapshot = useMemo(() => {
      let memoized = store.get()[key]
      return () => {
        let current = store.get()
        return Object.is(memoized, current) ? memoized[key] : (memoized = current[key])
      }
    }, [store.get()[key]])

    let state = useSyncExternalStore(
      store.subscribe,
      getSnapshot,
      getSnapshot
    )

    return state
  }

  // setter returns a setState fn for passed key
  const setter = sliceKey => {
    if (typeof sliceKey === 'undefined' && env !== 'production')
      throw new Error(
        '[use-state-g] you must pass a key retrieve setter in setter method'
      )

    const setState = nextState => {
      let newState =
        typeof nextState === 'function'
          ? nextState(store.get()[sliceKey])
          : nextState
      let obj = {}
      obj[sliceKey] = newState
      store.set(obj)
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

    const slice = store.get()[key]
    if (!slice && typeof value !== 'undefined') {
      let obj = {}
      obj[key] = value
      store.set(obj, false)
    }
  }

  // hook
  const useState = (key, value) => {
    if (!key && env !== 'production')
      throw new Error(
        '[use-state-g] you must pass a key to retreive state and setter'
      )

    const slice = store.get()[key]

    if (!slice && typeof value !== 'undefined') init(key, value)

    let state = useStore(key)

    return [state, setter(key)]
  }

  Object.assign(useState, {
    setter,
    init
  })

  return useState
}
