# Use-State-G
 
**Global useState Hook**

# Installation

```
npm i state-hook
```

or

```
yarn add state-hook
```

# Hook

```javascript
import { useStateG } from 'state-hook'
```

## Usage

```javascript
function ParentComponent() {
   let [state, setState] = useStateG('@uniqueKey', 'initialValue')  // Initialize the state in parent component
   
   console.log(state) // initialValue
   
   //...
}

function ChildComponent() {
  let [state, setState] = useStateG('@uniqueKey')  // Receive the state in child component
  
   console.log(state) // initialValue
  
  //...
}
```

**Note: @ is not necessary it just makes your uniqueKey more identical as a key.**

## Features

+ You don't have to go outside of your components to manage global state.
+ You can control rendering behaviour & optimize performance with some provided methods as discussed below.
+ Similar api as `useState`.
+ Maintainable code with single hook that manages your global state.

## Hook Methods

**You must initialize the state before you can consume it.** But the problem is if you initialize the state by calling the hook itself from a component
that component gets subscribed the `uniqueKey` you provided and triggers unnecessary rerender when the value assigned to `uniqueKey` changes. To solve
this problem you can use `init` method provided on `useStateG` hook itself.

### `init`
```javascript
function ParentComponent() {
  //...
  useStateG.init('@uniqueKey', 'initialValue')  // will initialize the state and assign it to `@uniqueKey`
                                                // will not rerender if value assigned to `@uniqueKey` changes
  //...
}

function ChildComponent() {
  let [state, setState] = useState('@uniqueKey')  // will rerender if value assigned to `@uniqueKey` changes
  
  //...
}
```

**Above problem may also arise when you only need setter function for specific state.** In this case you can use `setter` method provided on `useStateG`
hook itself.

### `setter`
```javascript
function ViewComponent() {
  let [state, setState] = useStateG('@uniqueKey', 'initialValue') // will rerender if value assigned to `@uniqueKey` changes
  
  //...
}

function ControlComponent() {
  let setState = useStateG('@uniqueKey')  // will retreive the setter function for value assigned to `@uniqueKey`
                                          // will not rerender if value assigned to `@uniqueKey` changes
  
  //...
}
```
