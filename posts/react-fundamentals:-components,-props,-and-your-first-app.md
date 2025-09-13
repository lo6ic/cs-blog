---
title: 'React Fundamentals: Components, Props, and Your First App'
description: "This post introduces the core React building blocks—components, props, and events—while walking you through setting up a local React project in VS Code and creating your first interactive Todo app."
published: true
datePublished: September 12, 2025
picture: "assets/posts/buildingblocks.jpg"
---

### React Fundamentals: Components, Props, and Your First App  

September 12th, 2025

#### Intro  

Welcome to **Part 2 of the React & Gatsby Learning Series**!  
In this series, I’m helping Angular developers (and front-end devs in general) understand React and Gatsby step by step. Each post builds on the last, includes a practical project, and highlights key comparisons between Angular and React (and later, Scully and Gatsby).  

If you missed the first post, check out <a href="https://christopherschedler.com/posts/from-angular-to-react:-understanding-the-mental-model-shift">Part 1: From Angular to React—Understanding the Mental Model Shift</a> to get grounded in the big-picture differences between Angular and React.  

---

#### Setting Up Your Local Development Environment  

Before we dive into components, let’s set up React locally so you can code along.  

1. **Install VS Code**  
   - Download from <a href="https://code.visualstudio.com" target="_blank">https://code.visualstudio.com</a>.  
   - Recommended extensions: *ES7+ React/Redux/React-Native snippets*, *Prettier*, and *React Developer Tools (browser)*.  

2. **Install Node.js & npm**  
   - Get the latest LTS version from <a href="https://nodejs.org" target="_blank">https://nodejs.org</a>.  
   - Confirm installation:  
     ```bash
     node -v
     npm -v
     ```  

3. **Create a New React App**  
   React no longer recommends `create-react-app` as the default starter, so we’ll use **Vite** (fast, lightweight, and modern).  

   ```bash
   npm create vite@latest my-first-react-app
   cd my-first-react-app
   npm install
   npm run dev
   ```
   - Open <a href="http://localhost:5173" target="_blank">http://localhost:5173</a> in your browser.

   - You now have a live React development environment running locally.

---

#### React Components

React is built on **components**—small, reusable building blocks of UI.

   - **Functional Components (modern approach)**: Functions that return JSX.

   - **Class Components (legacy)**: Older syntax, less common in modern codebases.

Example – A Simple Greeting Component:

```jsx
function Greeting() {
  return <h1>Hello, React!</h1>;
}

export default Greeting;
```

Add `<Greeting />` into your `App.jsx` file to render it.

--- 

#### Props: Passing Data Into Components

Props (short for *properties*) are like inputs to your components. They make components reusable and dynamic.

Example – Passing Props:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage inside App.jsx
<Greeting name="Chris" />
<Greeting name="Alex" />
```

   - In Angular, this is similar to using `@Input()` in a child component.

   - In React, props are immutable—components shouldn’t modify them.

---

#### Events: Handling User Interaction

React handles events using camelCase syntax and function references.

**Example – Button Click Event**:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

- In Angular, you’d use `(click)="method()"` inside templates.

- In React, you attach an event handler directly with `{}`.

---

#### Hands-On Project: A Simple Todo List

Let’s put it together:

**TodoList.jsx**

```jsx
import { useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const addTodo = () => {
    if (task.trim() === "") return;
    setTodos([...todos, task]);
    setTask("");
  };

  return (
    <div>
      <h2>My Todo List</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />
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

Add `<TodoList />` inside your `App.jsx` and you’ve got your first interactive React app.

---

#### Closing

✅ That wraps up **Part 2: React Fundamentals—Components, Props, and Your First App** of the React & Gatsby Learning Series!

**Key takeaways from this post**:

- React apps run locally with **Node.js + Vite + VS Code**.

- **Components** are the building blocks of UI.

- **Props** let you pass data into components, like Angular’s `@Input`.

- **Events** are handled inline with JavaScript expressions.

- You built your first **Todo List app** using components, props, and events.

In the next part, we’ll cover **React State and useEffect**, exploring how to manage local state and handle side effects like fetching or persisting data.

👉 If you found this helpful, follow the series, share with fellow Angular devs, and keep experimenting with your Todo app!

