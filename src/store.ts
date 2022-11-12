export interface StateObj {
  [key: string | number]: any
}

interface StoreApis {
  get: () => StateObj
  set: (next: StateObj, render?: boolean) => void
  subscribe: (cb: () => any | void) => () => boolean
}

export default function createStore(initial: StateObj): StoreApis {
  let state = initial
  let subscribers = new Set<() => any | void>()

  const get = () => state

  const set = (next: StateObj, render = true) => {
    state = Object.assign({}, state, next)
    if (!render) return
    subscribers.forEach(cb => cb())
  }

  const subscribe = (cb: () => void | any) => {
    subscribers.add(cb)
    return () => subscribers.delete(cb)
  }

  return {
    get,
    set,
    subscribe
  }
}
