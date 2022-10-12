import { create } from "react-tivity";

export default function createHook() {
  const useStore = create({});

  const state = useStore.state;

  const setter = (sliceKey) => {
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
        "[use-state] need to pass a key to retreive state and setter"
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
