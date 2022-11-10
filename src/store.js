export default function createStore(initial) {

    let state = initial
    let subscribers = new Set()

    const get = () => state

    const set = (next, render = true) => {
        state = Object.assign({}, state, next)
        if(!render) return
        subscribers.forEach(cb => cb())
    }

    const subscribe = (cb) => {
        subscribers.add(cb)
        return () => subscribers.delete(cb)
    }

    return {
        get,
        set,
        subscribe
    }

}