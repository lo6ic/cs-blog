---
title: "React Context and Advanced State Patterns"
description: "This post introduces React’s Context API and advanced state management patterns, helping developers avoid prop drilling and simplify data sharing across components. You’ll learn how to set up context providers and consumers, create a global theme switcher, and explore useReducer for handling complex state updates. Along the way, we compare these approaches to Angular’s services and dependency injection for a familiar perspective."
published: true
datePublished: September 29, 2025
picture: "assets/posts/cords.jpg"
---

### React Context and Advanced State Patterns

September 29th, 2025

#### Intro

Welcome to **Part 4 of the React & Gatsby Learning Series**!  
In this series, I’m helping Angular developers (and front-end devs in general) understand React and Gatsby step by step. Each post builds on the last, includes a practical project, and highlights key comparisons between Angular and React (and later, Scully and Gatsby).

If you missed the earlier posts, catch up here:

- [Part 1 - From Angular to React—Understanding the Mental Model Shift](https://christopherschedler.com/posts/from-angular-to-react:-understanding-the-mental-model-shift)
- [Part 2 - React Fundamentals: Components, Props, and Your First App](https://christopherschedler.com/posts/react-fundamentals:-components,-props,-and-your-first-app)
- [Part 3 - Mastering React State with useState and useEffect](https://christopherschedler.com/posts/react-state-and-side-effects-with-hooks)

---

#### The Problem: Prop Drilling

In the last post, we built a Todo app and introduced state management with `useState`. But what happens when you need to pass data several levels deep?

Example scenario:

- `App` component → passes user data → `Header` → `NavBar` → `ProfileLink`

This creates **prop drilling** — passing props through multiple components that don’t actually use them, just to reach a deeply nested child.

- **Angular comparison**: In Angular, you’d often use a **Service with dependency injection** to share state across components.
- **React solution**: Use the **Context API** to avoid manual prop chains.

---

#### The Context API

React’s **Context API** provides a way to share values (state, functions, themes, etc.) across the component tree without passing props manually.

**Steps to use Context:**

1. Create a context object with `createContext`.
2. Wrap components with a `Provider`.
3. Consume the context using `useContext`.

**Example – Theme Context:**

```jsx
import { createContext, useContext, useState } from "react";

// 1. Create the context
const ThemeContext = createContext();

// 2. Create a provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// 3. Custom hook for convenience
function useTheme() {
  return useContext(ThemeContext);
}

// Example consumer component
function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current theme: {theme} (click to toggle)</button>;
}

// Usage in App.jsx
function App() {
  return (
    <ThemeProvider>
      <h1>Welcome to the app!</h1>
      <ThemeButton />
    </ThemeProvider>
  );
}

export default App;
```

- `ThemeProvider` wraps the app and supplies values to all descendants.

- `useTheme()` makes consuming the context easier and cleaner.

---

#### When to Use Context

- Ideal for **global state** like themes, authentication, or user settings.

- Avoid using it for everything — large-scale state often benefits from **state management libraries** like Redux or Zustand.

Think of Context as a **lightweight shared state solution**.

---

#### Beyond Context: useReducer

For complex state updates (like managing objects or multiple transitions), `useReducer` can be a cleaner alternative to `useState`.

**Example – Todo Reducer**:

```jsx
import { useReducer } from "react";

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "REMOVE_TODO":
      return state.filter((_, i) => i !== action.index);
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return (
    <div>
      <button onClick={() => dispatch({ type: "ADD_TODO", payload: "New Task" })}>Add Task</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo} <button onClick={() => dispatch({ type: "REMOVE_TODO", index: i })}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

- Reducers follow a **predictable state transition pattern**.

- Similar to **NgRx in Angular**, but built directly into React.

---

#### Hands-On Project: Global Theme Switcher

Let’s enhance our Todo app by giving it a **global theme** toggle with Context.

1. Create a `ThemeContext` with `createContext`.

2. Wrap the Todo app with `ThemeProvider`.

3. Use `useContext` to switch styles across the app.

This allows every component (buttons, inputs, lists) to respond to the global theme without passing props down manually.

---

#### Closing

✅ That wraps up **Part 4: React Context and Advanced State Patterns** of the React & Gatsby Learning Series!

Key takeaways from this post:

- Prop drilling makes data sharing tedious in nested components.

- React’s **Context API** provides a simple solution for global state.

- `useReducer` is useful for managing complex state logic.

- This mirrors Angular’s **Services and dependency injection** vs React’s Context.

- You extended your Todo app with a **global theme switcher**.

In the next part, we’ll cover **React Routing and Navigation Patterns**, where we’ll build multi-page apps using React Router.

👉 If you found this helpful, follow the series, share with fellow Angular devs, and start experimenting with Context in your own apps!
