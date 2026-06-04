---
title: 'From Angular to React: Understanding the Mental Model Shift'
description: "This post introduces the key mental model shifts Angular developers need to embrace when learning React, highlighting differences in components, templates, state management, and lifecycle handling—complete with a hands-on counter example in both frameworks."
published: true
datePublished: September 10, 2025
picture: "assets/posts/backshift.jpg"
---

### From Angular to React: Understanding the Mental Model Shift

September 10th, 2025

#### Intro

Welcome to **Part 1 of the React & Gatsby Learning Series**!
In this series, I’m helping Angular developers (and front-end devs in general) understand React and Gatsby step by step. Each post builds on the last, includes a practical project, and highlights key comparisons between Angular and React (and later, Scully and Gatsby).

If you’re just joining in, this is the first post in the series—so you’re in the right place!

#### Why the Mental Model Matters

When I first moved from Angular to React, I quickly realized it wasn’t just about swapping out syntax or tools—it required rethinking how I approached building user interfaces. Angular and React share goals, but the way they get there is fundamentally different.

- **Angular**: A full-featured, opinionated framework that gives you built-in solutions for routing, forms, HTTP, and more. It provides “the Angular way” of doing things.

- **React**: A lightweight, unopinionated library that focuses solely on the view layer. Everything else—routing, state management, data fetching—is chosen and assembled by you.

That’s the biggest shift: Angular is prescriptive, React is flexible.

#### High-Level Overview of React

Before diving deeper into differences, let’s step back and look at what React is all about.

- **What React Is**: A JavaScript library developed by Meta (Facebook) for building user interfaces. It’s declarative and component-driven.

- **Philosophy**: Build UIs from small, reusable pieces called components. Manage state and props to drive how those components render.

**Core Features**:

- **Components**: Encapsulated pieces of UI logic.

- **JSX**: JavaScript syntax extension that blends markup and logic.

- **State & Props**: State represents local data, props represent external inputs passed to components.

- **Hooks**: Functions like useState and useEffect that manage state and side effects.

- **Unidirectional Data Flow**: Data always flows from parent → child, making the app easier to reason about.

Think of React as *LEGO blocks for UI*—you decide how to assemble them, rather than following a pre-defined construction manual.

#### Key Shifts for Angular Developers

1. Component-Based Architecture

    - Angular: Components + Modules + Services, with decorators and metadata.

    - React: Components are just functions (or classes, in older codebases) that return JSX.

2. Templates vs JSX

    - Angular: Separate HTML templates with structural directives (`*ngIf`, `*ngFor`).

    - React: JSX allows you to write markup *inside JavaScript*, with conditional rendering handled directly via expressions.

3. State Management

    - Angular: Two-way data binding (`[(ngModel)]`) keeps templates and component state in sync automatically.

    - React: Embraces **one-way data flow**—state changes in a parent cascade down via props, and children notify parents via callbacks.

4. Lifecycle Hooks vs useEffect

    - Angular: Uses lifecycle hooks like `ngOnInit`, `ngOnChanges`, `ngOnDestroy`.

    - React: Consolidates these into the `useEffect` hook, which handles side effects and cleanup.

![YMental Model](/assets/posts/angularreactmentalmodel.png)

#### Hands-On Project: A Simple Counter

To see these differences in action, let’s build a simple counter in both Angular and React.

**Angular (simplified)**:

```
@Component({
  selector: 'app-counter',
  template: `
    <button (click)="increment()">Count: {{ count }}</button>
  `
})
export class CounterComponent {
  count = 0;
  increment() {
    this.count++;
  }
}
```

**React (with hooks)**:

```
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

export default Counter;
```

Notice how React eliminates decorators and metadata—you just use a function and hooks.

#### Closing

✅ That wraps up **Part 1: From Angular to React—Understanding the Mental Model Shift** of the React & Gatsby Learning Series!

Key takeaways from this post:

- React is a UI library, not a full framework like Angular.

- JSX blends markup and logic in a single file.

- React enforces unidirectional data flow, unlike Angular’s two-way binding.

- Hooks like `useEffect` replace Angular’s lifecycle hooks.

In the next part, we’ll cover <a href="https://christopherschedler.com/posts/react-fundamentals:-components,-props,-and-your-first-app">**React Fundamentals: Components, Props, and Your First App**</a>—you’ll learn the basics of props, event handling, and conditional rendering by building a simple Todo app.

👉 If you found this helpful, follow along with the series, share with fellow Angular devs making the transition, and keep an eye out for upcoming posts.
