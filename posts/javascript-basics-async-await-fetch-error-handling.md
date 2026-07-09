---
title: "JavaScript Basics: Deep Work Session with async/await, fetch, and Error Handling"
description: "A practical teaching article on readable async code, fetch validation, mapping API responses, and the mistakes people commonly misunderstand."
published: true
datePublished: "July 8, 2026"
picture: "assets/posts/error.jpg"
---

### JavaScript Basics: Deep Work Session with async/await, fetch, and Error Handling

July 8, 2026

In today’s article, I wanted to take an `async/await` practice session and turn it into something more useful than a plain code recap.

The goal was not only to review syntax, but to slow down and teach the ideas in a way that would still hold up later during debugging, Angular development, or an interview.

This lesson focused on a few important pieces of async JavaScript:

1. using `async` and `await` to write readable async code
2. handling errors with `try`, `catch`, and `finally`
3. validating `response.ok` when using `fetch`
4. mapping raw API responses into smaller frontend-friendly models
5. explaining why `async/await` improves readability, while still knowing where it can go wrong

This is one of those JavaScript topics that feels straightforward at first, but it becomes much more important once code starts loading real data from APIs.

---

#### Why This Topic Matters

`async/await` is one of the most useful readability improvements in modern JavaScript.

It does not remove asynchronous behavior, and it does not magically make code synchronous. What it does is make async code easier to read from top to bottom.

That matters because a lot of async bugs are not caused by syntax alone. They come from misunderstanding the flow:

- when code waits
- when it does not wait
- what happens when a request fails
- what happens when a request returns a bad HTTP status
- what an `async` function actually returns

A lot of people can write `await fetch(...)` and still feel unsure when they need to explain what the code is doing.

That is why this kind of lesson matters.

The point is not to memorize `try/catch`. The point is to understand how async flow, response validation, data mapping, and error handling work together.

That deeper understanding makes async code much easier to debug and much easier to explain in interviews.

---

#### Exercise 1: Fetch a User and Validate the Response

A strong first exercise for `async/await` is to fetch real data, validate the response, and then map the raw API object into a smaller model.

Here is the function:

```javascript
async function loadUser() {
  try {
    console.log("Loading user...");

    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

    if (!response.ok) {
      throw new Error(`Error in response: ${response.status}`);
    }

    const data = await response.json();

    const mapped = {
      id: data.id,
      name: data.name,
      email: data.email,
    };

    console.log("User loaded:", mapped);
    return mapped;
  } catch (error) {
    console.error("Technical error:", error.message);
    return {
      error: true,
      message: "Something went wrong while loading data. Please try again.",
    };
  } finally {
    console.log("User request finished");
  }
}

loadUser();
```

This is a very practical teaching example because it shows a complete async flow in one place.

- the request starts
- the response is checked
- the JSON body is parsed
- the data is mapped into a smaller object
- technical errors are caught
- cleanup logging happens in `finally`

That structure is one of the main reasons `async/await` improves readability. The whole sequence reads in the order it happens.

The mapping step is also important. In real frontend work, the UI usually does not need the full raw backend object. It often needs a smaller model that contains only the fields the feature actually cares about.

---

#### What to Pay Attention to in Exercise 1

Sometimes people miss that `fetch()` does not automatically reject the Promise just because the server returned an HTTP error like `404` or `500`.

That is one of the most important ideas in this lesson.

A highlight I want to bring up is that `response.ok` needs to be checked manually. Without that check, code may keep going down the success path even though the request did not actually succeed in a useful way.

Another thing people sometimes misunderstand is how to build an `Error` message. `Error()` does not behave like `console.log()` with multiple separate values. The error message needs to be built as one string, often with string concatenation or a template literal.

It is also common for people to focus on getting JSON back and forget that the mapped object is the more useful final shape for the rest of the application. Returning a smaller model is a very practical frontend habit.

---

#### Exercise 2: Build a Reusable `fetchJson` Helper

The second exercise introduces a very useful design idea: separate the generic data-fetching work from the feature-specific mapping work.

Here is a clean version of that pattern:

```javascript
async function fetchJson(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Response error on url: " + url);
    }

    return await response.json();
  } catch (error) {
    throw new Error("There was an issue with url: " + url);
  } finally {
    console.log("Finished fetchJson() with url: " + url);
  }
}

async function loadPost() {
  try {
    const data = await fetchJson("https://jsonplaceholder.typicode.com/posts/1");

    const post = {
      id: data.id,
      title: data.title,
    };

    console.log(post);
  } catch (error) {
    console.error(error.message);
  }
}

loadPost();
```

This exercise is useful because it teaches a cleaner separation of responsibilities.

The helper function does the generic work:

- fetch the resource
- validate the response
- parse the JSON

Then the feature-level function decides how to shape that data for the UI.

That is a good habit because it keeps reusable helpers truly reusable. A helper called `fetchJson` should usually return parsed JSON, not feature-shaped data for one specific screen.

That kind of separation becomes even more useful in Angular services, where generic HTTP utilities and feature-specific mapping often belong in different layers of the code.

---

#### What to Pay Attention to in Exercise 2

A highlight I want to bring up is that function names matter.

If a function is named `fetchJson`, most developers will expect it to return parsed JSON, not a partially transformed object like `{ id, title }`.

Sometimes people miss that returning feature-shaped data too early can make a supposedly generic helper much less reusable.

Another teaching point here is error strategy. In some cases, it makes sense for a helper to catch an error and return a fallback object. In other cases, it is better to re-throw the error so the calling function can decide how to handle it.

That design choice matters because it affects how much flexibility the rest of the application has.

The bigger lesson is that readability is not only about syntax. It is also about architecture. Clean async code is easier to follow when each function has one clear responsibility.

---

#### Exercise 3: Practice `async/await` with a Mock Promise

A mock exercise is helpful because it removes network uncertainty and lets the async pattern stand on its own.

Here is the setup:

```javascript
function fakeFetchUser(shouldSucceed, delay = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve({
          id: 1,
          name: "Ava",
          email: "ava@example.com",
          role: "admin",
        });
      } else {
        reject(new Error("Network request failed"));
      }
    }, delay);
  });
}

async function loadMockUser() {
  try {
    const mockUserResponse = await fakeFetchUser(true);

    const mappedUser = {
      id: mockUserResponse.id,
      name: mockUserResponse.name,
      email: mockUserResponse.email,
    };

    return mappedUser;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  } finally {
    console.log("Finished loadMockUser.");
  }
}

loadMockUser().then((user) => {
  console.log("Returned:", user);
});
```

This is a strong teaching example because it isolates one very important idea:

`async` functions always return Promises.

Even if the function appears to `return` a plain object, the actual result is still wrapped in a Promise. That is why logging `loadMockUser()` directly will show the Promise, not the final resolved user object.

To see the resolved value, the code has to either:

- `await` the async function
- or attach `.then()` to the returned Promise

That is one of the most important mental models to lock in early.

---

#### What to Pay Attention to in Exercise 3

Sometimes people miss that `await` works on the inside of an `async` function, but the outside caller still has to handle the returned Promise.

That can be confusing at first because the code inside the function feels very direct and synchronous. But from the caller’s point of view, it is still asynchronous.

A highlight I want to bring up is that this is exactly why `console.log(loadMockUser())` shows a Promise object. The value is not wrong. It just has not been resolved in the caller’s code yet.

Another thing people sometimes misunderstand is that mock exercises are not “less real.” They are often one of the best ways to learn the control flow without extra noise from API quirks, network issues, or response shape problems.

---

#### Why `async/await` Improves Readability

A major explanation goal from this session was being able to answer a common interview question:

> Why does `async/await` improve readability, and where can it still go wrong?

A good answer is this:

`async/await` improves readability because it lets asynchronous code read more like normal top-to-bottom code. Instead of long `.then()` chains, related logic can stay together in one function. It also works well with `try/catch/finally`, which makes success, error handling, and cleanup logic easier to organize in one place.

That is the readability win.

But it is just as important to understand what `async/await` does not solve.

It does not remove the need for error handling. It does not automatically validate `fetch()` responses. It does not change the fact that `async` functions return Promises. And it can still lead to poor code if developers write sequential awaits where independent work could have run in parallel.

So the best explanation is balanced: `async/await` improves readability, but it does not remove the need to understand asynchronous behavior.

---

#### Common Mistakes to Watch For

A few mistakes in this topic show up again and again.

#### 1. Forgetting to check `response.ok`

This is one of the most common `fetch()` misunderstandings.

A response can fail at the HTTP level without automatically throwing into `catch`.

#### 2. Treating `Error()` like `console.log()`

Error messages need to be built as one string.

#### 3. Making a generic helper too specific

A helper named `fetchJson()` should usually stay generic and return parsed JSON.

#### 4. Forgetting that `async` functions return Promises

Even when an object is returned inside the function, the caller still receives a Promise.

#### 5. Thinking `async/await` removes async complexity

It improves readability, but it does not remove the need to understand timing, control flow, and failure paths.

---

#### Why This Matters in Angular

This is exactly the kind of JavaScript foundation that helps in Angular work.

A lot of frontend tasks look like this:

- call an API
- validate the response
- map the raw data into a cleaner model
- handle loading and error states
- return something the component can use safely

Even though Angular often uses `HttpClient` and RxJS Observables, the same core ideas still matter:

- async work completes later
- errors must be handled intentionally
- raw response shapes should not leak everywhere
- readability matters when code grows more complex

That is why this kind of JavaScript practice is not separate from Angular. It supports it directly.

---

#### Final Takeaway

My biggest takeaway from this session is that `async/await` becomes much more useful when it is treated as a readability tool, not just a syntax shortcut.

This lesson was not just about replacing `.then()` with `await`. It was about building a more complete async mental model:

- requests can fail in more than one way
- `fetch()` responses need to be validated
- mapped models are often more useful than raw API objects
- helper functions should have clear responsibilities
- `async` functions still return Promises

The more clearly these ideas can be explained in a small exercise, the easier they will be to use later in a real Angular application or a technical interview.
