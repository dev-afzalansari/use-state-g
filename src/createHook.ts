import createStore from './store'
import { useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js'

export default function createHook() {
  const store = createStore({})
  const env = process.env.NODE_ENV

  const useStore = (key: string) => {
    const getSnapshot = useMemo(() => {
      let memoized = store.get()
      return () => {
        let current = store.get()
        return Object.is(memoized[key], current[key])
          ? memoized[key]
          : (memoized[key] = current[key])
      }
    }, [store.get()[key], key])

    let state = useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)

    return state
  }

  // setter returns a setState fn for passed key
  const setter = (sliceKey: string) => {
    if (typeof sliceKey === 'undefined' && env !== 'production')
      throw new Error(
        '[use-state-g] you must pass a key to retrieve setter in setter method'
      )

    const setState = (nextState: any) => {
      let newState =
        typeof nextState === 'function'
          ? nextState(store.get()[sliceKey])
          : nextState
      let obj: any = {}
      obj[sliceKey] = newState
      store.set(obj)
    }

    return setState
  }

  // to set the initial state without causing an update
  const init = (key: string, value: any) => {
    if (
      typeof key === 'undefined' ||
      (typeof value === 'undefined' && env !== 'production')
    )
      throw new Error(
        '[use-state-g] you must pass a key and corresponding value to the init method'
      )

    const slice = store.get()[key]
    if (!slice && typeof value !== 'undefined') {
      let obj: any = {}
      obj[key] = value
      store.set(obj, false)
    }
  }

  // hook
  const useState = (key: string, value?: any) => {
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
