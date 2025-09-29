---
title: React State and Side Effects with Hooks
description: "This post explores how React’s useState and useEffect hooks manage component state and side effects. You’ll learn to update local data, handle lifecycle-like behavior, and persist your Todo app with localStorage."
published: true
datePublished: September 19, 2025
picture: "assets/posts/hooks.jpg"
---

### React State and Side Effects with Hooks

September 19th, 2025

#### Intro

Welcome to **Part 3 of the React & Gatsby Learning Series**!

In this series, I’m helping Angular developers (and front-end devs in general) understand React and Gatsby step by step. Each post builds on the last, includes a practical project, and highlights key comparisons between Angular and React (and later, Scully and Gatsby).

If you missed the previous posts, check out:

- [Part 1: From Angular to React: Understanding the Mental Model Shift](https://christopherschedler.com/posts/from-angular-to-react:-understanding-the-mental-model-shift)
- [Part 2: React Fundamentals: Components, Props, and Your First App](https://christopherschedler.com/posts/react-fundamentals:-components,-props,-and-your-first-app)

---

#### Why State Matters

In React, **state** is how your components keep track of dynamic data. Unlike props (which are passed in), state is **local and managed within the component itself**.

- **Angular comparison**: Think of state as the component’s own data model, similar to a property you’d track inside an Angular component class.
- In React, updating state triggers a re-render, keeping the UI in sync with your data.

---

#### The `useState` Hook

The `useState` hook is the most common way to add state to a functional component.

**Example – Counter with State:**

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

export default Counter;
```

- `count` is the current state value.

- `setCount` is the function used to update it.

- Updating state automatically re-renders the component.

---

#### The `useEffect` Hook

While `useState` manages local data, `useEffect` handles **side effects**—code that affects something outside the component or reacts to changes over time.

Common uses for `useEffect`:

- Fetching data from an API

- Subscribing to events

- Working with browser APIs (localStorage, document title, etc.)

- Cleanup tasks (unsubscribe, clear timers, etc.)

**Example – Updating Document Title**:

```jsx
import { useState, useEffect } from "react";

function TitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}

export default TitleUpdater;
```

- The effect runs every time `count` changes.

- The second argument (`[count]`) is the **dependency array**.

- If the array is empty `[]`, the effect only runs once (on mount).

---

### Cleanup with `useEffect`

Some side effects need cleanup to avoid memory leaks.

**Example – Timer with Cleanup**:

```jsx
import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, []);

  return <p>Timer: {seconds}s</p>;
}

export default Timer;
```

The cleanup function (return () => ...) runs when the component unmounts, or before the effect re-runs.

### Hands-On Project: Persistent Todo List

Let’s expand the Todo app from Part 2 by adding **localStorage persistence** using `useEffect`.

**TodoList.jsx**

```jsx
import { useState, useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [task, setTask] = useState("");

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (task.trim() === "") return;
    setTodos([...todos, task]);
    setTask("");
  };

  return (
    <div>
      <h2>My Persistent Todo List</h2>
      <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter a task" />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
```

Now your tasks will persist even after a browser refresh.

---

### Closing

✅ That wraps up **Part 3: Mastering React State with useState and useEffect** of the React & Gatsby Learning Series!

**Key takeaways from this post**:

- `useState` gives components their own local data.

- `useEffect` runs side effects like fetching, subscribing, or syncing with browser APIs.

- The dependency array controls **when** an effect runs.

- Cleanup functions prevent memory leaks.

- You upgraded your Todo app to **persist tasks** with **localStorage**.

In the next part, we’ll cover [React Context and Advanced State Patterns](https://christopherschedler.com/posts/react-context-and-advanced-state-patterns), exploring how to handle global state without excessive prop drilling.

👉 If you found this helpful, follow the series, share with fellow Angular devs, and keep building on your Todo app!
