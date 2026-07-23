---
title: "JavaScript Basics: Deep Work Session with an Async Mini App"
description: "A practical teaching article on building a tiny data viewer with loading, success, and error states while mapping raw API data into a UI-ready object."
published: true
datePublished: "July 9, 2026"
picture: "assets/posts/api.jpg"
---

### JavaScript Basics: Deep Work Session with an Async Mini App

July 9, 2026

In today’s article, I wanted to take the last few async JavaScript lessons and bring them together into a small frontend-style exercise.

This was not a day for learning one brand new syntax feature.

Instead, the goal was to combine several pieces that show up constantly in real frontend work:

1. setting loading state
2. fetching data
3. validating the response
4. handling errors
5. transforming raw API data
6. rendering success or failure output

This kind of exercise matters because a lot of frontend development is really data flow work.

The code might look simple in a console-based example, but the same pattern shows up in Angular applications all the time. A component needs data, a service or function retrieves it, the response gets shaped into something useful, and the UI updates based on loading, success, or error state.

That is the core idea behind this session.

---

#### Why an Async Mini App Matters

A single `fetch` call is useful, but it is not enough by itself.

In a real application, the question is not only:

> Can I get data?

The better question is:

> Can I manage the full user experience around getting data?

That means the code needs to answer a few practical questions:

- What should the user see while the request is loading?
- What should happen if the request succeeds?
- What should happen if the request fails?
- Should the UI use the raw API response directly?
- Where should the data transformation happen?
- How does the final object get stored and displayed?

This is why a mini data viewer is a useful drill.

It forces the async code to become more than just a request. It becomes a small version of a real frontend workflow.

---

#### The Small Problem Being Solved

The goal was to build a tiny user data viewer.

The app starts with a state object:

```javascript
const state = {
  loading: false,
  error: null,
  user: null
};
```

That object describes what the UI should show.

If `loading` is `true`, the app should show a loading message.

If `error` has a value, the app should show an error message.

If `user` has a value, the app should show the user information.

That state shape is simple, but it is very important.

A lot of frontend UI logic is based on this same idea:

```javascript
{
  loading,
  error,
  data
}
```

The names may change, but the pattern is everywhere.

---

#### Exercise 1: Building the Data Viewer with a Real API

The first exercise was to build the data viewer using a real endpoint.

The API used in the exercise was:

```javascript
const correctUrl = "https://jsonplaceholder.typicode.com/users/1";
```

The app needed a few separate pieces:

```javascript
function render() {}

async function fetchJson(url) {}

function mapUserToViewModel(rawUser) {}

async function loadUser(theUrl) {}
```

That separation is important.

Each function should have a clear responsibility:

- `render()` displays the current state
- `fetchJson(url)` fetches and parses JSON
- `mapUserToViewModel(rawUser)` reshapes raw API data
- `loadUser(theUrl)` coordinates the async flow

This keeps the code easier to understand and easier to explain.

---

#### Rendering Based on State

The `render()` function is responsible for looking at state and deciding what to show.

A simple version looks like this:

```javascript
function render() {
  if (state.loading) {
    console.log("Loading...");
    return;
  }

  if (state.error) {
    console.log("Error state:", state.error);
    return;
  }

  if (state.user) {
    console.log("---User---");
    console.log(`Id: ${state.user.id}`);
    console.log(`Display Name: ${state.user.displayName}`);
    console.log(`Contact: ${state.user.contact}`);
    console.log(`Company Name: ${state.user.companyName}`);
    return;
  }

  console.log("No user loaded.");
}
```

This is a good mental model for UI work.

The render function should not be responsible for fetching data. It should not be responsible for mapping the API response. Its job is to read the current state and display the right result.

That is a small version of how Angular templates work too.

The template reacts to component state.

---

#### Fetching JSON

The next piece is a helper function for fetching JSON.

A clean version looks like this:

```javascript
async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error: " + response.status);
  }

  return await response.json();
}
```

This function has one clear job.

It fetches a URL, checks the response, and returns parsed JSON.

A highlight I want to bring up is that `fetch()` does not automatically throw just because the server returns a status like `404` or `500`.

That is why this check matters:

```javascript
if (!response.ok) {
  throw new Error("Error: " + response.status);
}
```

Without that check, the code may continue as if the request succeeded, even though the HTTP response was not actually good.

---

#### Mapping the API Response

The next piece is the mapping function.

The raw API user has more information than this little viewer needs.

So the mapping function extracts the fields that matter:

```javascript
function mapUserToViewModel(rawUser) {
  return {
    id: rawUser.id,
    displayName: rawUser.name,
    contact: rawUser.email,
    companyName: rawUser.company.name
  };
}
```

This function takes the raw API object and turns it into a smaller UI-ready object.

That is an important habit.

Instead of spreading raw API data all over the app, a mapping function creates a clean boundary between the API shape and the UI shape.

In this example, the API uses:

```javascript
rawUser.name
rawUser.email
rawUser.company.name
```

But the UI wants:

```javascript
displayName
contact
companyName
```

That transformation gives the UI cleaner names and a simpler object to work with.

---

#### Loading the User

The `loadUser()` function coordinates the full async flow.

A clean version looks like this:

```javascript
async function loadUser(theUrl) {
  state.loading = true;
  state.error = null;
  state.user = null;
  render();

  try {
    const rawUser = await fetchJson(theUrl);
    const mappedUser = mapUserToViewModel(rawUser);

    state.user = mappedUser;
  } catch (error) {
    console.log("Error in loadUser:", error.message);
    state.error = "Something went wrong while loading the user.";
  } finally {
    console.log("Finished loading user...");
    state.loading = false;
    render();
  }
}
```

This function shows the full request-to-render flow.

First, it turns loading on and clears old data:

```javascript
state.loading = true;
state.error = null;
state.user = null;
render();
```

Then it fetches the raw data:

```javascript
const rawUser = await fetchJson(theUrl);
```

Then it maps the raw data:

```javascript
const mappedUser = mapUserToViewModel(rawUser);
```

Then it stores the mapped object in state:

```javascript
state.user = mappedUser;
```

Finally, the `finally` block turns loading off and renders the final result:

```javascript
state.loading = false;
render();
```

That is the key pattern.

The user sees loading first, then either success or error.

---

#### Exercise 2: Forcing the Error State

The second exercise was to intentionally test the error path.

A URL like this can be used to force a bad response:

```javascript
const incorrectUrl = "https://jsonplaceholder.typicode.com/users/bad-url";
```

The point of this exercise is not just to break the code.

The point is to prove the error state actually works.

Sometimes people miss this part because they only test the happy path. They run the successful request, see the user print to the console, and assume the feature is done.

But a frontend data flow is not really complete until all three states have been tested:

```javascript
loading
success
error
```

If the error path has not been tested, there may still be a bug hiding in the flow.

---

#### A Highlight About Error Propagation

A highlight I want to bring up is how errors move through the code.

A first attempt at `fetchJson()` might look like this:

```javascript
async function fetchJson(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw Error("Error: " + response.status);
    }

    return await response.json();
  } catch (error) {
    console.log("Error with fetch response:", error.message);
  }
}
```

This looks reasonable at first because it has a `try/catch`.

But there is a hidden problem.

The function catches the error and logs it, but it does not throw the error again or return a clear failure value.

That means the function may return `undefined`.

Then the calling code might try to do this:

```javascript
const mappedUser = mapUserToViewModel(theJson);
```

But if `theJson` is `undefined`, the mapper cannot safely read properties like:

```javascript
rawUser.id
rawUser.name
rawUser.company.name
```

Sometimes people miss this idea because they think logging an error means the error has been handled.

But in application flow, logging is not always handling.

If the caller needs to update UI state, the caller needs to know that the request failed.

That is why a helper like `fetchJson()` should usually do one of two things:

```javascript
return valid data;
```

or:

```javascript
throw an error;
```

It should not quietly fail and leave the rest of the code guessing.

---

#### Exercise 3: Building a Mock API Version

The third exercise used a fake async function instead of a real API.

The fake API looked like this:

```javascript
function fakeFetchUser(shouldSucceed = true, delay = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!shouldSucceed) {
        reject(new Error("Mock request failed"));
        return;
      }

      resolve({
        id: 7,
        name: "Maya Chen",
        email: "maya@example.com",
        company: {
          name: "Remote Dev Studio"
        },
        role: "Frontend Engineer"
      });
    }, delay);
  });
}
```

This mock function is useful because it allows the same loading, success, and error flow to be practiced without relying on a real network request.

A clean `loadMockUser()` function can look like this:

```javascript
async function loadMockUser(toLoad) {
  state.loading = true;
  state.error = null;
  state.user = null;
  render();

  try {
    const rawUser = await fakeFetchUser(toLoad);
    const mappedUser = mapUserToViewModel(rawUser);

    state.user = mappedUser;
  } catch (error) {
    console.log("Error in loadMockUser:", error.message);
    state.error = "Something went wrong while loading the mock user.";
  } finally {
    console.log("Finished loading mock user...");
    state.loading = false;
    render();
  }
}
```

This follows the same pattern as the real API version.

The source of the data changed, but the data flow stayed the same:

```javascript
start loading
fetch or mock fetch raw data
map raw data
store mapped data
render final state
```

That is a very important idea.

Good frontend code often keeps the same structure even when the data source changes.

---

#### A Highlight About Mixing `.then()` and `await`

A highlight I want to bring up is that `.then()` and `await` can work together, but mixing them is not always necessary.

For example, this works:

```javascript
const mappedUser = fakeFetchUser(toLoad).then(theJson => {
  return mapUserToViewModel(theJson);
});

state.user = await mappedUser;
```

But inside an `async` function, this is usually easier to read:

```javascript
const rawUser = await fakeFetchUser(toLoad);
const mappedUser = mapUserToViewModel(rawUser);

state.user = mappedUser;
```

Both versions are based on Promises.

But the second version reads more clearly from top to bottom.

Sometimes people miss this because they learn Promises first with `.then()` and then add `async/await` later. That can lead to code that technically works but is harder to explain.

A good rule is:

> If the function is already using `async/await`, prefer staying with `await` unless there is a specific reason to use `.then()`.

That makes the flow easier to read and easier to talk through in an interview.

---

#### A Closer Look at the Data Flow

The main explanation practice for this session was:

> Show how data flows from request to transformed UI-ready object.

A strong explanation goes like this.

First, the app updates state so the user knows loading has started.

```javascript
state.loading = true;
state.error = null;
state.user = null;
render();
```

Then the app makes the request and gets the raw API data.

```javascript
const rawUser = await fetchJson(theUrl);
```

Inside `fetchJson()`, the response is validated and parsed from JSON into a JavaScript object.

Then that raw object is passed into the mapping function.

```javascript
const mappedUser = mapUserToViewModel(rawUser);
```

The mapper returns a smaller object shaped specifically for the UI.

Then the app stores that mapped object in state.

```javascript
state.user = mappedUser;
```

Finally, loading is turned off and the UI renders the final state.

```javascript
state.loading = false;
render();
```

If anything fails along the way, the `catch` block updates the error state instead.

That is the full flow.

---

#### JSON Versus JavaScript Objects

One small but important clarification is the difference between JSON and JavaScript objects.

A server often sends data as JSON text.

When this line runs:

```javascript
const data = await response.json();
```

the JSON response is parsed into a JavaScript object.

Then the mapping function transforms that JavaScript object into another JavaScript object that is more useful for the UI.

So the flow is:

```javascript
HTTP response
```

then:

```javascript
JSON parsing
```

then:

```javascript
raw JavaScript object
```

then:

```javascript
UI-ready JavaScript object
```

Sometimes people use the word JSON for all of these steps, but it is useful to be precise.

That precision helps during interviews and debugging.

---

#### Full Clean Version

Here is a clean version of the full mini app:

```javascript
const state = {
  loading: false,
  error: null,
  user: null
};

function render() {
  if (state.loading) {
    console.log("Loading...");
    return;
  }

  if (state.error) {
    console.log("Error state:", state.error);
    return;
  }

  if (state.user) {
    console.log("---User---");
    console.log(`Id: ${state.user.id}`);
    console.log(`Display Name: ${state.user.displayName}`);
    console.log(`Contact: ${state.user.contact}`);
    console.log(`Company Name: ${state.user.companyName}`);
    return;
  }

  console.log("No user loaded.");
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error: " + response.status);
  }

  return await response.json();
}

function mapUserToViewModel(rawUser) {
  return {
    id: rawUser.id,
    displayName: rawUser.name,
    contact: rawUser.email,
    companyName: rawUser.company.name
  };
}

async function loadUser(theUrl) {
  state.loading = true;
  state.error = null;
  state.user = null;
  render();

  try {
    const rawUser = await fetchJson(theUrl);
    const mappedUser = mapUserToViewModel(rawUser);

    state.user = mappedUser;
  } catch (error) {
    console.log("Error in loadUser:", error.message);
    state.error = "Something went wrong while loading the user.";
  } finally {
    console.log("Finished loading user...");
    state.loading = false;
    render();
  }
}

function fakeFetchUser(shouldSucceed = true, delay = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!shouldSucceed) {
        reject(new Error("Mock request failed"));
        return;
      }

      resolve({
        id: 7,
        name: "Maya Chen",
        email: "maya@example.com",
        company: {
          name: "Remote Dev Studio"
        },
        role: "Frontend Engineer"
      });
    }, delay);
  });
}

async function loadMockUser(toLoad) {
  state.loading = true;
  state.error = null;
  state.user = null;
  render();

  try {
    const rawUser = await fakeFetchUser(toLoad);
    const mappedUser = mapUserToViewModel(rawUser);

    state.user = mappedUser;
  } catch (error) {
    console.log("Error in loadMockUser:", error.message);
    state.error = "Something went wrong while loading the mock user.";
  } finally {
    console.log("Finished loading mock user...");
    state.loading = false;
    render();
  }
}

const correctUrl = "https://jsonplaceholder.typicode.com/users/1";
const incorrectUrl = "https://jsonplaceholder.typicode.com/users/bad-url";

// Test success:
// loadUser(correctUrl);

// Test API error:
// loadUser(incorrectUrl);

// Test mock success:
// loadMockUser(true);

// Test mock error:
loadMockUser(false);
```

---

#### Common Things to Pay Attention To

There are a few easy places to get tripped up in this exercise.

#### 1. Sometimes people catch errors too early

A helper function like `fetchJson()` should usually return valid data or throw an error.

If it catches the error and does nothing else, the rest of the app may receive `undefined`.

That can create a second, less obvious bug.

#### 2. Sometimes people test only the successful request

The happy path is only one part of the feature.

A real data viewer needs loading, success, and error states.

All three should be tested.

#### 3. Sometimes people use raw API data directly in the UI

That may work in a small example, but mapping the response creates a cleaner boundary.

The UI should use a shape that makes sense for the UI.

#### 4. Sometimes people mix `.then()` and `await` unnecessarily

Both are valid Promise tools.

But if a function is already written with `async/await`, staying with `await` often makes the code easier to read.

#### 5. Sometimes people blur JSON and JavaScript objects

`response.json()` parses JSON into a JavaScript object.

After that, the mapper is working with JavaScript objects, not raw JSON text.

This is a small wording detail, but it matters for clear explanations.

---

#### Why This Matters in Angular

This lesson connects directly to Angular development.

In an Angular app, the same pattern might show up as:

- a service method that fetches data
- a mapper that transforms an API response into a frontend model
- a component that tracks loading, error, and data state
- a template that displays the right UI based on that state

The plain JavaScript version is useful because it removes the Angular-specific details and makes the core data flow easier to see.

Before adding Angular services, RxJS streams, signals, or templates, it helps to understand the basic flow:

```javascript
request
validate
parse
map
store
render
```

That is the foundation.

---

#### Interview-Ready Explanation

If I had to explain this in an interview, I would say:

> The data flow starts by updating state so the UI can show that loading has started. Then the app makes the request, validates the HTTP response, and parses the JSON into a JavaScript object. After that, the raw API object is passed into a mapping function that extracts only the fields the UI needs. The mapped object is assigned into state, loading is turned off, and the render function displays the success state. If anything fails during the request, validation, parsing, or mapping steps, the catch block updates the error state so the UI can show a user-friendly failure message.

That explanation is strong because it shows the whole flow, not just the fetch call.

---

#### Final Takeaway

The biggest takeaway from this deep work session is that async frontend code is not just about calling `fetch`.

The real skill is managing the full flow around the request.

That means knowing how to:

- show loading state
- validate the response
- handle errors
- map raw data into a cleaner model
- update state
- render the right output

This small console-based data viewer is a simple version of the same pattern used in real Angular applications.

The more clearly this pattern can be explained, the easier it becomes to reason about larger frontend features later.
