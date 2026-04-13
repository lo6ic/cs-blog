---
title: "JavaScript Basics: Closures and Lexical Scope"
description: "A practical, first-person walkthrough of closures and lexical scope in JavaScript, with simple examples, common bugs, and the mental models that finally made the topic click for me."
published: true
datePublished: "April 12, 2026"
picture: "assets/posts/react2.jpg"
---

### Understanding Closures and Lexical Scope in JavaScript

April 12, 2026

I spent this study session brushing up on **closures** and **lexical scope** in JavaScript, and this ended up being one of those topics that feels much clearer once you stop treating it like a mysterious interview buzzword.

At first, closures can sound abstract. But the more I practiced them, the more I realized they show up in very normal code: counters, callbacks, event handlers, validators, factory functions, and anywhere I want to preserve state without exposing it globally.

This post is my attempt to explain closures the way I wish someone had explained them to me earlier.

---

#### The simple mental model

A closure is when a function **remembers the variables from where it was created**, even after the outer function has finished running.

The idea that makes this possible is **lexical scope**.

#### Scope

Scope is just **where a variable can be accessed**.

#### Lexical scope

Lexical scope means variable access is based on **where code is written**, not where it gets called.

So if a function is written inside another function, it can access variables from that outer function.

#### Closure

A closure happens when that inner function keeps access to those outer variables **later**, even after the outer function has already returned.

That is the part that makes closures so useful.

---

#### A basic closure example

```js
function makeGreeting(name) {
  return function () {
    return `Hello, ${name}`;
  };
}

const greetJohn = makeGreeting("John");
console.log(greetJohn()); // Hello, John
```

`makeGreeting` finishes running, but `greetJohn` still has access to `name`.

That is a closure.

---

#### The example that made it click for me: a counter factory

One of the best ways to understand closure is with a counter.

```js
function createCounter(step) {
  let count = 0;

  return function () {
    count += step;
    return count;
  };
}

const counter = createCounter(2);
console.log(counter()); // 2
console.log(counter()); // 4
console.log(counter()); // 6
```

What helped me here was noticing that the returned function still has access to both:

- `count`
- `step`

Even though `createCounter` has already finished executing, the inner function still remembers those variables.

That means it can keep updating private state over time.

This is a huge reason closures matter in real code: they let me keep state **without using globals**.

---

#### Closures are often about private state

Another practice exercise I worked on was a todo manager.

```js
function createTodoManager() {
  let todoList = [];

  return {
    add(todo) {
      todoList.push(todo);
    },
    list() {
      return [...todoList];
    },
    remove(index) {
      todoList.splice(index, 1);
    },
  };
}

const todos = createTodoManager();
todos.add("Study closures");
todos.add("Practice RxJS later");

console.log(todos.list()); // ['Study closures', 'Practice RxJS later']
todos.remove(0);
console.log(todos.list()); // ['Practice RxJS later']
```

This example taught me something important:

The methods `add`, `list`, and `remove` are all functions, and they all **close over the same `todoList` variable**.

That means:

- they share the same private state
- code outside the function cannot directly access `todoList`
- I can control how that state changes through a small API

That is a great use case for closures: **encapsulation**.

One subtle thing I learned here is that returning the actual array directly is less safe. Returning a copy with `[...]` protects the internal state better.

---

#### Another good private state example

I also practiced a secret holder.

```js
function createSecretHolder(initialSecret) {
  let secret = initialSecret;

  return {
    getSecret() {
      return secret;
    },
    setSecret(newSecret) {
      secret = newSecret;
    },
  };
}

const holder = createSecretHolder("test");
console.log(holder.getSecret()); // test

holder.setSecret("newTest");
console.log(holder.getSecret()); // newTest
```

This helped reinforce that closures are not only about returning a single function.

They can also be used when returning an object full of methods.

Those methods still count as closures because they retain access to variables from the outer lexical scope.

---

#### A mistake I learned to watch for

One thing I do not want to miss when explaining closures is that they can also create bugs.

The classic one is a loop with `var`.

```js
const fns = [];

for (var i = 0; i < 3; i++) {
  fns.push(function () {
    return i;
  });
}

console.log(fns[0]()); // 3
console.log(fns[1]()); // 3
console.log(fns[2]()); // 3
```

At first glance, it looks like it should print `0`, `1`, and `2`.

But it prints `3`, `3`, and `3`.

Why?

Because all three functions close over the **same `i`**, and by the time they run, the loop has already finished and `i` is `3`.

The fix is to use `let`, because `let` creates a new binding for each loop iteration.

```js
const fns = [];

for (let i = 0; i < 3; i++) {
  fns.push(function () {
    return i;
  });
}

console.log(fns[0]()); // 0
console.log(fns[1]()); // 1
console.log(fns[2]()); // 2
```

This was a helpful reminder that closures do not magically freeze values. They keep access to **variable bindings**, and those bindings can change.

---

#### What I think matters most in real code

The most useful takeaway for me is this:

Closures matter because JavaScript uses functions everywhere.

That means closures show up naturally in:

- callbacks
- event listeners
- async code
- timers
- factory functions
- validators
- configuration helpers
- Angular code

Even if I am not explicitly saying “I am writing a closure right now,” I am often relying on closure behavior.

For example, a validator factory keeps configuration around:

```js
function minLengthValidator(min) {
  return function (value) {
    return value.length >= min;
  };
}

const isLongEnough = minLengthValidator(5);

console.log(isLongEnough("abc")); // false
console.log(isLongEnough("abcdef")); // true
```

The returned function remembers `min`.

That is closure-based configuration, and patterns like that show up all over frontend development.

---

#### My explanation

If I had to explain it simply, I would say:

> A closure is when a function keeps access to variables from its outer lexical scope, even after the outer function has already finished executing. This matters because JavaScript uses functions heavily in callbacks, event handlers, factories, and async code, so closures are a normal way to preserve state over time. They are useful for private state and reusable function factories, but they can also cause bugs when multiple functions accidentally share mutable state.

That is probably the clearest version I have landed on so far.

---

#### The difference between scope, lexical scope, and closure

This distinction helped me a lot:

- **Scope** = where variables are accessible
- **Lexical scope** = access is based on where code is written
- **Closure** = a function retaining access to variables from its outer lexical environment after the outer function has finished

That breakdown makes the topic feel much less mystical.

---

### Recommended videos that helped reinforce this

Two references I would absolutely recommend:

#### Lydia Hallie

Lydia Hallie’s **JavaScript Visualized – Closures** is excellent if you want a strong mental model and visual explanation.

- Channel: <a href="https://www.youtube.com/@theavocoder" target="_blank" rel="noopener noreferrer">https://www.youtube.com/@theavocoder</a>
- Video: <a href="https://www.youtube.com/watch?v=6Ixyltr8_R0" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=6Ixyltr8_R0</a>

#### Akshay Saini

Akshay Saini’s **Closures in JS | Namaste JavaScript Episode 10** is especially good for interview-style understanding and deeper JavaScript fundamentals.

- Channel: <a href="https://www.youtube.com/@akshaymarch7" target="_blank" rel="noopener noreferrer">https://www.youtube.com/@akshaymarch7</a>
- Video: <a href="https://www.youtube.com/watch?v=qikxEIxsXco" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=qikxEIxsXco</a>

I would personally watch Lydia Hallie first for intuition, then Akshay Saini for a deeper and more interview-focused explanation.

---

## Final takeaway

Closures are not rare or advanced edge-case JavaScript.

They are one of the most normal and useful parts of the language.

The big thing I wanted to internalize from this session is:

A closure is not about “returning a function” by itself. It is about a function continuing to have access to variables from where it was created.

Once I started looking at closures as **functions carrying their surrounding state with them**, the whole topic became much easier to understand.

---

#### Practice prompts

If you are learning this too, here are a few exercises that helped me:

1. Write `createCounter(step)`
2. Write `createSecretHolder(secret)`
3. Write `createTodoManager()`
4. Create the classic `var` loop closure bug
5. Fix that bug with `let`

If you can explain why each one works, you are probably understanding closures for real instead of just recognizing examples.
