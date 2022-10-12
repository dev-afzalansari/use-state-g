import { create } from "react-tivity";

export default function createHook() {
  const useStore = create({});

  const state = useStore.state;

  const setter = (sliceKey) => {
    if(typeof sliceKey === 'undefined') throw new Error('[state-hook] you must pass a key retrieve setter in setter method')

    const setState = (nextState) => {
      let newState =
        typeof nextState === "function"
          ? nextState(state.get()[sliceKey])
          : nextState;
      let obj = {};
      obj[sliceKey] = newState;
      state.set(obj);
    };

    return setState;
  };

  const init = (key, value) => {
    if(typeof key === 'undefined' || typeof value === 'undefined') throw new Error('[state-hook] you must pass a key and corresponding value to the init method')

    const slice = state.get()[key];
    if (!slice && typeof value !== "undefined") {
      let obj = {};
      obj[key] = value;
      state.set(obj, false);
    }
  };

  const useState = (key, value) => {
    if (!key)
      throw new Error(
        "[state-hook] you must pass a key to retreive state and setter"
      );

    const slice = state.get()[key];

    if (!slice && typeof value !== "undefined") init(key, value);

    useStore((s) => s[key]);

    return [state.get()[key], setter(key)];
  };

  Object.assign(useState, {
    setter,
    init,
  });

  return useState;
}
