---
title: React Router and Navigation
description: "This post introduces React Router and shows how to build multi-page applications in React. You’ll learn how to set up routes, use dynamic parameters, create protected pages, and navigate programmatically—while comparing these patterns to Angular’s built-in Router. By the end, your Todo app will evolve into a fully navigable multi-page app."
published: true
datePublished: October 3, 2025
picture: "assets/posts/routemap.jpg"
tags:
  - react
  - routing
  - navigation
---

### React Router and Navigation

October 3rd, 2025

#### Intro

Welcome to **Part 5 of the React & Gatsby Learning Series**!
In this series, I’m helping Angular developers (and front-end devs in general) understand React and Gatsby step by step. Each post builds on the last, includes a practical project, and highlights key comparisons between Angular and React (and later, Scully and Gatsby).

If you missed earlier posts, here’s a quick recap:

- [Part 1 - From Angular to React—Understanding the Mental Model Shift](https://christopherschedler.com/posts/from-angular-to-react:-understanding-the-mental-model-shift)
- [Part 2 - React Fundamentals: Components, Props, and Your First App](https://christopherschedler.com/posts/react-fundamentals:-components,-props,-and-your-first-app)
- [Part 3 - Mastering React State with useState and useEffect](https://christopherschedler.com/posts/react-state-and-side-effects-with-hooks)
- [Part 4 - React Context and Advanced State Patterns](https://christopherschedler.com/posts/react-context-and-advanced-state-patterns)

Now, it’s time to learn how to navigate between pages and build multi-page React applications.

---

#### Why Routing Matters

React by itself doesn’t include routing. Unlike Angular, which comes with the Angular Router built in, React is just a UI library. To handle routing, we typically rely on **React Router**, a widely used and feature-rich library that allows you to define and navigate between different views in a React app.

Think of React Router as React’s answer to Angular’s `RouterModule`. It provides:

- URL-based navigation

- Route parameters

- Programmatic navigation

- Protected routes and guards

---

#### Installing React Router

If you’re following along locally with Vite, install React Router:

```bash
npm install react-router-dom
```

---

#### Basic Setup

To use React Router, wrap your app in a `BrowserRouter` and define your routes inside it.

Example:

```jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
```

- `BrowserRouter` manages navigation history.

- `Routes` contains multiple `Route` definitions.

- `Link` is used instead of `<a>` to enable client-side navigation without a full page reload.

---

#### Dynamic Routing

You can create routes that accept parameters, just like Angular route params.

```jsx
import { useParams } from "react-router-dom";

function Profile() {
  const { username } = useParams();
  return <h2>Profile page for {username}</h2>;
}

// Usage in routes
<Route path="/profile/:username" element={<Profile />} />;
```

Now `/profile/chris` will render “Profile page for chris.”

---

#### Protected Routes

Sometimes you only want users with certain conditions (like being logged in) to access a route. You can implement protected routes with conditional logic.

```jsx
function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <h2>Access Denied</h2>;
}

// Usage
<Route
  path="/dashboard"
  element={
    <PrivateRoute isAuthenticated={true}>
      <Dashboard />
    </PrivateRoute>
  }
/>;
```

---

#### Programmatic Navigation

React Router also lets you navigate in code using the `useNavigate` hook.

```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // pretend login is successful
    navigate("/dashboard");
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

This is equivalent to Angular’s `router.navigate()`.

---

Here is a quick visual comparison of Angular vs React routes:

![Angular vs React Routes](/assets/posts/routercompare.png "Angular vs React Routes")

---

#### Hands-On Project: Multi-Page Todo App

Let’s expand our Todo app by splitting it into multiple routes:

- `/` → Home page with welcome message

- `/todos` → The Todo list component

- `/about` → About page

This structure will help your app feel like a real, multi-page experience while still using client-side rendering.

---

#### Closing

✅ That wraps up **Part 5: React Routing and Navigation** of the React & Gatsby Learning Series!

Key takeaways from this post:

- React does not include routing by default — React Router is the go-to solution.

- `BrowserRouter`, `Routes`, and `Route` define navigation.

- Dynamic routes allow parameters like `/profile/:username`.

- Protected routes and programmatic navigation give you control over access and flow.

- You expanded your Todo app into a **multi-page application**.

In the next part, we’ll dive into Performance Optimization in React, where we’ll learn how to speed up apps with memoization, lazy loading, and profiling.

👉 If you found this helpful, follow the series, share with fellow Angular devs, and keep building your multi-page React app!
