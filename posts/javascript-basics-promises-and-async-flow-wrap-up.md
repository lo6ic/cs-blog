---
title: "JavaScript Basics: Deep Work Session with Promises and Async Flow"
description: "A practical teaching article on Promise states, chaining, cleanup, and the async flow mistakes people commonly misunderstand."
published: true
datePublished: "July 2, 2026"
picture: "assets/posts/two.jpg"
---

### JavaScript Basics: Deep Work Session with Promises and Async Flow

July 2, 2026

In today’s article, I wanted to turn a Promise practice session into something a little more useful than just a set of notes.

The goal was not only to review Promise syntax, but to slow down and teach the ideas in a way that would still make sense later during debugging, Angular development, or an interview.

This lesson focused on a few core pieces of async JavaScript:

1. understanding Promise states
2. using `.then()`, `.catch()`, and `.finally()`
3. practicing clean Promise chaining
4. spotting the very common mistake of forgetting to `return` a Promise
5. explaining what problem Promises solve over plain callbacks

This is one of those JavaScript topics that looks simple on the surface, but becomes much more important once applications start loading real data.

---

#### Why This Topic Matters

Promises are one of the foundations of modern JavaScript.

Even in Angular, where RxJS and Observables are a major part of application code, Promise knowledge still matters because it teaches the core mental model of asynchronous flow: work starts now, but the result arrives later.

A lot of people can read Promise syntax and still feel shaky when they have to explain what the code is doing.

That is why this kind of lesson matters.

The point is not to memorize `.then()` and `.catch()`. The point is to understand how success, failure, cleanup, and chaining fit together.

That deeper understanding makes async code easier to debug and much easier to explain in interviews.

---

#### Exercise 1: Build a Fake API Call with a Promise

A strong first exercise for Promises is to simulate the kind of thing frontend code does all the time: make a request, wait for a result, and respond correctly whether it succeeds or fails.

Here is the function:

```javascript
function fetchProfile(shouldSucceed, delay = 500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve({ id: 101, username: "dev_user" });
      } else {
        reject(new Error("Profile request failed"));
      }
    }, delay);
  });
}
```

This is a good teaching example because it makes the Promise lifecycle very visible.

- `new Promise(...)` creates the Promise
- `resolve(...)` marks it as fulfilled
- `reject(...)` marks it as rejected
- `setTimeout(...)` simulates work that finishes later

That last point matters a lot. Promises are useful because they represent future completion. The value is not ready immediately, so the code has to describe what should happen when the result finally arrives.

A success example looks like this:

```javascript
console.log("Loading profile...");

fetchProfile(true, 1000)
  .then((data) => {
    console.log("Profile loaded:", data);
  })
  .catch((error) => {
    console.error("Profile Error:", error.message);
  })
  .finally(() => {
    console.log("Profile request finished.");
  });
```

An error example looks the same, except the call uses `false`:

```javascript
console.log("Loading profile...");

fetchProfile(false, 1000)
  .then((data) => {
    console.log("Profile loaded:", data);
  })
  .catch((error) => {
    console.error("Profile Error:", error.message);
  })
  .finally(() => {
    console.log("Profile request finished.");
  });
```

This exercise teaches a very practical pattern:

- log or show loading before the request starts
- handle the success path in `.then()`
- handle the error path in `.catch()`
- handle cleanup in `.finally()`

That pattern maps directly to real frontend work.

---

#### What to Pay Attention to in Exercise 1

One idea people often miss here is that both calls can start almost at the same time if they are written one after another.

That means both `"Loading profile..."` messages may print before either request finishes.

That is not a bug. That is simply async behavior.

Another misunderstanding that shows up a lot is thinking `.finally()` is only for success cases. It is not.

`.finally()` runs whether the Promise is fulfilled or rejected, which makes it a good place for cleanup work like stopping a spinner, hiding a loading state, or writing a final log message.

It is also common for people to focus so much on the success path that they forget the error path needs just as much clarity. In real applications, the error path is part of the design, not an afterthought.

---

#### Promise States: The Core Mental Model

Before moving into chaining, it helps to pause and define the three Promise states clearly:

1. `pending`
2. `fulfilled`
3. `rejected`

A simple way to teach this is with a coffee shop mental model:

- `pending` means the order is still being prepared
- `fulfilled` means the drink is ready
- `rejected` means the order could not be completed

This is useful because it makes the abstraction easier to visualize.

One detail that deserves extra attention is that a Promise settles only once.

Once it becomes fulfilled or rejected, it does not keep changing. That is an important distinction because some people accidentally think of Promises more like streams of values. That is not how Promises work. A Promise represents one eventual outcome.

---

#### Exercise 2: Chain Async Steps Instead of Nesting Them

The second exercise teaches one of the most important Promise habits: when one async step depends on the previous step, return the next Promise so the chain stays connected.

Here is the setup:

```javascript
function fetchUser() {
  return new Promise((resolve) => {
    resolve({ id: 7, name: "Maya" });
  });
}

function fetchTasks(userId) {
  return new Promise((resolve) => {
    resolve(["Fix bug", "Write tests", "Review PR"]);
  });
}
```

Then the two async steps are chained together:

```javascript
fetchUser()
  .then((user) => {
    console.log("User:", user);
    return fetchTasks(user.id);
  })
  .then((tasks) => {
    console.log("Tasks:", tasks);
  })
  .catch((error) => {
    console.log("Error:", error);
  })
  .finally(() => console.log("Complete"));
```

This is a great teaching example because it shows the shape of real async flow.

The first Promise resolves with a user. Then that user data is used to start the second async step. Because `fetchTasks(user.id)` is returned, the next `.then()` waits for it and receives the resolved tasks.

This is what good chaining looks like.

It keeps the code flatter, easier to follow, and easier to debug.

A lot of older async code ended up deeply nested because each callback was written inside the previous callback. Promises improved that by making the next step part of a readable chain.

---

#### What to Pay Attention to in Exercise 2

The biggest teaching point in this exercise is the `return` inside the first `.then()`:

```javascript
return fetchTasks(user.id);
```

That single line is what keeps the chain alive.

I have seen many examples where people correctly call the next async function, but forget to return it. When that happens, the next `.then()` does not receive the resolved value from that async step.

That mistake is one of the most common Promise bugs beginners and intermediate developers run into.

Another thing people sometimes misunderstand is that chaining is not just about style. It is about control flow.

Returning the Promise tells JavaScript, in effect, “this chain is still in progress; wait for this next async step before moving on.”

That is why chaining is more than prettier syntax. It is how the sequence actually stays correct.

---

#### Exercise 3: Find the Missing Return Bug

A useful teaching exercise is to look at a short Promise chain and identify why the result becomes `undefined`.

Here is the example:

```javascript
function step1() {
  return Promise.resolve("Step 1 done");
}

function step2() {
  return Promise.resolve("Step 2 done");
}

step1()
  .then((result) => {
    console.log(result);
    step2();
  })
  .then((result) => {
    console.log(result);
  });
```

At first glance, this can look fine because `step2()` is being called.

But the bug is that `step2()` is not being returned from the first `.then()` callback.

That means the second `.then()` is not waiting for `step2()` to resolve, and it does not receive the value `"Step 2 done"`.

Instead, it receives `undefined`.

The corrected version is:

```javascript
step1()
  .then((result) => {
    console.log(result);
    return step2();
  })
  .then((result) => {
    console.log(result);
  });
```

This is one of the best Promise drills because it teaches that calling a Promise-returning function is not enough by itself. In a chain, the Promise usually needs to be returned so the next step can wait for it.

---

#### What to Pay Attention to in Exercise 3

One misunderstanding that shows up often is imprecise language around the bug.

People may say something like “the Promise returned `undefined`” or “`step2()` got `undefined`,” but that is not quite the right explanation.

The more accurate explanation is this:

- `step2()` is called inside the first `.then()`
- its Promise is not returned
- because it is not returned into the chain, the next `.then()` does not wait for it
- the next `.then()` receives `undefined`

That precision matters, especially in interviews.

A candidate who can explain exactly where the chain broke and what effect that had usually sounds much stronger than someone who only says “it does not work.”

---

#### Why Promises Were Better Than Plain Callbacks

A big explanation goal from this session was being able to answer a common interview question:

> What problem do Promises solve over plain callbacks?

A good teaching answer is this:

Promises provide a more structured way to handle asynchronous operations. They solve the problem of callback-heavy code, where multiple async steps can become deeply nested and hard to follow. Instead of stacking callbacks inside callbacks, Promises let code chain async work more cleanly with `.then()`. They also improve error handling because failures can be handled in one place with `.catch()`, and cleanup logic can be placed in `.finally()`. Overall, Promises make asynchronous code easier to read, reason about, and maintain.

That answer works well because it highlights the actual improvement:

- flatter control flow
- cleaner chaining
- centralized error handling
- better readability

That is the difference people mean when they talk about “callback hell.”

---

#### Common Things to Watch For

A few Promise misunderstandings come up so often that they are worth calling out directly.

#### 1. Calling a Promise-returning function without returning it from `.then()`

This is the classic broken-chain bug.

The next `.then()` only receives the resolved value if the Promise is returned.

#### 2. Confusing calling with chaining

Some people assume that because the second async function was called, the chain will automatically wait for it.

That is not true.

The chain only waits for what is returned.

#### 3. Forgetting that `.finally()` runs on success and failure

This is easy to miss at first, but it is one of the most useful cleanup tools in Promise-based code.

#### 4. Thinking Promises make code synchronous

Promises improve structure, but they do not make asynchronous work happen instantly.

Synchronous code still runs first, and Promise callbacks run afterward.

#### 5. Treating error handling as optional

In learning examples, it is tempting to focus only on the happy path. In real work, clear error handling is part of writing complete async code.

---

#### Why This Matters in Angular

Even though Angular uses Observables heavily, Promise fundamentals still matter because they train the same async thinking skills:

- understanding delayed results
- separating success and failure paths
- managing cleanup
- following async control flow
- explaining why a value is not available yet

A lot of JavaScript interview questions are still rooted in these fundamentals.

That means Promise practice is not a detour from Angular preparation. It is part of building the foundation underneath it.

---

#### Final Takeaway

The biggest takeaway from this session is that Promise syntax is not the hard part.

The more important skill is being able to explain what the chain is doing and why each step is placed where it is.

A good Promise learner eventually becomes able to say:

- what state the Promise is in
- where the success path lives
- where the error path lives
- where cleanup belongs
- why a missing `return` breaks the chain
- why Promises are easier to manage than nested callbacks

That is where the learning starts to become usable in interviews and real application code.

For a topic that looks small on the surface, Promises teach a lot of the thinking that modern frontend development depends on.
