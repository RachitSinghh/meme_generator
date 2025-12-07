# Controlled Components

- React components where form input values are controlled by React state. The input's value is set by state, and changes are handled through event handlers that update the state, making React the "single source of truth" for the input data.

# Function Programming

- A programming paradigm that treats computation as the evaluation of mathematical functions, emphasizing immutability, pure functions, and avoiding side effects to create more predictable and maintainable code.

## Main Principals

- Pure Functions: A function that always returns the same output for the same input and doesn't modify anything outside itself (no side effects).

```js
// ✅ PURE FUNCTION
function add(a, b) {
  return a + b;
}

add(2, 3); // Always returns 5
add(2, 3); // Always returns 5 - predictable!

// ❌ NOT PURE - Has side effect
let total = 0;
function addToTotal(num) {
  total += num; // Modifies external variable
  return total;
}

addToTotal(5); // Returns 5
addToTotal(5); // Returns 10 - different output for same input!
```

- Immutability: Data cannot be changed after it's created. Instead of modifying existing data, you create new copies with the desired changes.

```js
// ❌ BAD - Mutating state directly
const [todos, setTodos] = useState([]);
todos.push(newTodo); // This mutates the array!

// ✅ GOOD - Creating new array
const [todos, setTodos] = useState([]);
setTodos([...todos, newTodo]); // New array with new item
```

- Avoiding side effects: A side effect is when a function interacts with or changes something outside its own scope (external systems, variables, DOM, etc.).

```js
// ✅ Pure - always returns same output for same input
function add(a, b) {
  return a + b;
}
```

Function with side Effects:

```js
// ❌ Has side effects
let count = 0;
function increment() {
  count++; // Modifies external variable
  localStorage.setItem("count", count); // Touches external system
  console.log(count); // Outputs to console
}
```

In React Context:

```js
// ❌ Side effect in render - causes problems
function Component() {
  fetch("/api/data"); // Side effect runs every render!
  return <div>Hello</div>;
}

// ✅ Side effect in useEffect - controlled
function Component() {
  useEffect(() => {
    fetch("/api/data"); // Runs only when you specify
  }, []);
  return <div>Hello</div>;
}
```

## Fetching Data in react

1. GET THE Data
2. SAVE THE DATA IN STATE

```JS
export default function App(props) {
    const [starWarsData, setStarWarsData] = React.useState(null)

    console.lo

    fetch("https://swapi.dev/api/people/1")
        .then(res => res.json())
        .then(data => setStarWarsData(data))

    return (
        <div>
            <pre>{JSON.stringify(starWarsData, null, 2)}</pre>
        </div>
    )
}
```

=> Naive approach to fetch data in React

### Why we're stuck in this infinite loop in this react code

- The React component run from top to bottom every time it renders. so when you this inside the component:

```js
fetch("https://swapi.dev/api/people/1")
  .then((res) => res.json())
  .then((data) => setStarWarsData(data));
```

React Does this:

1. Component renders
2. Fetch run
3. You call setStarWarData
4. setStarWarsData tells React: "Hey, data changed, render again"
5. React renders again
6. The fetch runs again
7. setStarWarsData run again
8. ... and this keeps going forever

### How react deals with state

- think of state like a box React Keeps aside:
  when you call: `setStarWarData(data)`
- you're telling react:
  "Hey, i changes something inside the box. Please repaint the screen so everything stays accruate".

- So react repaints the component.
- But if you change the box while it's repainting, React repaints agian.
- This is why putting fetch directly in the render path is the problem

### How React Decideds what should get displayed to the screen

- React follows very simple rule:

_Whatever your functions returns is what i'll paint_

- your function returns this:  
   ```js
    return(
    <div>
        <pre>{JSON.stringify(starWarsData, null, 2)}</pre>
    </div>
    )
    ```
  so React says:
  "I'll put that on the screen. And whenever something changes, i'll call your function again and repaint everything"

  React Does NOT magically know when to stop it only listens to state changes.

### How it Decideds whether Components should render or not

React re-renders a component if any of these happen: 1. You call a state setter (like setStarWarsData) 2. You call a context setter 3. Props change 4. A parent component re-renders 5. a strict node in a development intentionally double-checks renders

    that's it

    so in your case:
    - fetch -> new data -> setStarWarsData -> re-render -> fetch again -> loop

#### Summary of the above questions

- Your fetch runs again and again because react keeps re-rendering
- React re-renders because the state keeps changing.
- Putting fetch inside the component body is like telling React "Keep doing this every time"
- useEffect tells React "do it only once. "
- React shows whatever your return statement tells it to.

### What are React's primary task?

- Work with the DOM/browser to render UI to the page
- Manage state focus between render cycles (i.e. state sides are "remembered" from one render to the next)
- keep the UI updated whenever state or props changes occur

### What can't React Handle on its owns

- (Out)side effects!
  - localStorage
  - API/database Integration
  - subscription (e.g. websocket connection)
  - Basically anything that react isn't in charge of

## Fetching data using useEffect

```JS
export default function App(props) {
    const [starWarsData, setStarWarsData] = React.useState(null)


    useEffect(function(){
      fetch("https://swapi.dev/api/people/1")
          .then(res => res.json())
          .then(data => setStarWarsData(data))

    },[setWarsdata])

    // dependencies are gives us some control over when our effect funciton runs and we learned that React is going to compare values inside of our dependencies array from one render to next in order to determine whether the effect is function should run again.

    return (
        <div>
            <pre>{JSON.stringify(starWarsData, null, 2)}</pre>
        </div>
    )
}
```

# Quiz

1. **In what way are React components meant to be "pure functions"**

   - Given the same props or state, the component will always return the same content, or UI
   - Rendering and re-rendering a component will never have any kind of side effect on an outside system

2. **What is a "Side effect" in React? What are some examples?**
   - local storage, API, websockets, DOM manipulation
   - Any code that affects or interacts with an outside system
3. What is NOT a "side effect" in React? Examples?

   - Maintaing state, keeping the UI in sync with data, rendering DOM elements
   - Anything that React is in charge of.

4. When does React run your useEffect function? when does it NOT run the effect funciton?

   - On every re-render of the component (assuming no dependencies array)
   - As soon as the component renders for the first time
   - Will NOT run the effect when the values of the dependencies in the array stay the same between renders

5. How would you explain what the "dependencies array" is ?
   - Second parameter to the useEffect function
   - A way for React to know whether or not it should re-run the effect function
