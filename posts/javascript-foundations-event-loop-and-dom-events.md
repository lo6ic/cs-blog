---
title: "JavaScript Foundations: DOM Events, the Event Loop, and Async Execution"
description: "A practical refresher on the JavaScript event loop, microtasks, macrotasks, promises, and why async logs print in surprising order."
published: true
datePublished: "June 5, 2026"
picture: "assets/posts/react2.jpg"
---

## JavaScript Foundations: DOM Events, the Event Loop, and Async Execution

June 5, 2026

In today’s article, I want to focus on some of the most important JavaScript concepts for modern front-end development:

1. How JavaScript executes code using the **call stack**
2. Why async code prints in surprising orders
3. The difference between **microtasks** and **macrotasks**
4. Why `Promise.then()` can run before `setTimeout(..., 0)`

This topic initially feels confusing because the output order can seem random. But once I built a mental model for how JavaScript schedules work, it became much easier to predict what would happen before even running the code.

These concepts are extremely important for Angular, RxJS, timers, HTTP requests, UI rendering, and debugging asynchronous behavior.

---

### The Mental Model: JavaScript Is Single-Threaded

JavaScript executes one thing at a time.

The easiest way to think about this is:

> JavaScript has **one chef in one kitchen**.

That chef can only cook one meal at a time.

This is called the **call stack**.

### The Call Stack

The call stack is where JavaScript executes synchronous code.

Example:

```js
console.log("A");
console.log("B");
console.log("C");
```

Output:

```text
A
B
C
```

This was straightforward because JavaScript simply executes line by line.

The important takeaway:

> **Synchronous code always runs first.**

That became one of the biggest lessons from today.

---

### Browser APIs and Timers

Some tasks take time:

- `setTimeout`
- DOM events
- HTTP requests
- fetch calls

Instead of blocking JavaScript, the browser handles them separately.

Example:

```js
setTimeout(() => {
  console.log("timer");
}, 1000);
```

JavaScript essentially says:

> “Let me know when this is ready.”

Then it continues running the rest of the code.

This led to one important realization:

> `setTimeout(..., 0)` does **not** mean immediate.

It means:

> “Run this later when the stack is empty.”

---

### Tasks vs Microtasks

One of the most important ideas from today was understanding queue priority.

There are two important queues:

#### Task Queue (Macrotask Queue)

Examples:

- `setTimeout`
- DOM events
- timers

Example:

```js
setTimeout(() => {
  console.log("timeout");
}, 0);
```

#### Microtask Queue

Examples:

- `Promise.then()`
- `queueMicrotask()`

Example:

```js
Promise.resolve().then(() => {
  console.log("promise");
});
```

The key idea:

> **Microtasks run before macrotasks.**

This explains why promise callbacks often run before timers.

Mental model:

```text
Call Stack
↓
Microtasks (Promises)
↓
Tasks / Macrotasks (setTimeout)
```

This single diagram unlocked most of the confusing examples.

---

### Example 1: Promise vs Synchronous Code

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

Before running this code, I predicted the output.

Output:

```text
A
C
B
```

Why?

1. Synchronous code runs first

```text
A
C
```

2. The stack empties
3. Microtasks execute

```text
B
```

A simple explanation:

> `Promise.then()` creates the microtask, and the callback executes after synchronous code completes.

---

### Example 2: setTimeout Is Not Immediate

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");
```

Output:

```text
1
3
2
```

Why?

1. Sync code runs first

```text
1
3
```

2. No microtasks exist
3. Task queue runs

```text
2
```

This reinforced:

> **Sync first → microtasks → tasks**

---

### Example 3: Promise vs setTimeout

```js
console.log("start");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");
```

Output:

```text
start
end
promise
timeout
```

Why?

1. Sync code runs first

```text
start
end
```

2. Promise microtasks execute

```text
promise
```

3. Task queue executes

```text
timeout
```

This finally answered an interview question that could feel confusing:

> Why can `Promise.then()` run before `setTimeout(..., 0)`?

Answer:

> `Promise.then()` runs in the **microtask queue**, which has higher priority than the task/macrotask queue used by `setTimeout()`.

---

### Example 4: Multiple Promises

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

Promise.resolve().then(() => {
  console.log("4");
});

console.log("5");
```

Prediction:

```text
1
5
3
4
2
```

Correct.

Why?

1. Synchronous code executes first

```text
1
5
```

2. Microtasks run in insertion order

```text
3
4
```

3. Macrotasks run afterward

```text
2
```

This example helped reinforce that:

> **Promises maintain their order inside the microtask queue.**

---

### Example 5: Nested Async Behavior

```js
console.log("start");

setTimeout(() => {
  console.log("timeout");

  Promise.resolve().then(() => {
    console.log("promise");
  });
}, 0);

console.log("end");
```

Prediction:

```text
start
end
timeout
promise
```

Correct.

Why?

1. Sync code runs first

```text
start
end
```

2. The timeout callback runs

```text
timeout
```

3. The promise is created **inside** the timeout callback
4. That promise becomes a microtask after the timeout work finishes

```text
promise
```

This helped me understand an important nuance:

> Microtasks have higher priority, but they only exist after they are created.

---

### What Initially Threw Me Off

The biggest thing that could have been confusing was:

> Why does `Promise.then()` sometimes run before `setTimeout(..., 0)`?

At first glance, `setTimeout(..., 0)` feels like it should happen immediately.

But the better mental model became:

> “Run this later when the stack is empty.”

Promises felt less confusing once I understood:

> They are async too — just **higher-priority async**.

The biggest unlock was remembering:

> **Sync first → microtasks → tasks**

That one sentence solved almost every example.

---

### Angular Connection

This matters directly in Angular.

Example:

```ts
this.http.get("/users").subscribe(() => {
  console.log("data");
});

console.log("done");
```

Output:

```text
done
data
```

Why?

HTTP requests are asynchronous.

Angular and RxJS depend heavily on event-loop behavior.

The stronger my understanding of JavaScript execution order becomes, the easier Angular debugging and interview questions become.

---

### Final Takeaways

The biggest ideas from today:

- JavaScript is **single-threaded**
- Synchronous code runs first
- Promises are **microtasks**
- `setTimeout()` uses the **task/macrotask queue**
- Microtasks run before tasks
- `setTimeout(..., 0)` is **not immediate**

The retention phrase from today:

> **Sync first → microtasks → tasks**
