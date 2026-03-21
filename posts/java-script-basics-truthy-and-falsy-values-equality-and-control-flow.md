---
title: "JavaScript Basics: Truthy and Falsy Values, Equality, and Control Flow"
description: "A practical refresher on truthy and falsy values, strict equality, short-circuiting, nullish coalescing, and optional chaining."
published: true
datePublished: "March 21, 2026"
picture: "assets/posts/arrow.jpg"
---

### JavaScript Basics: Truthy and Falsy Values, Equality, and Control Flow

March 21, 2026

In today’s article, I want to focus on a set of JavaScript basics that show up constantly in real-world frontend work:

1. How JavaScript treats truthy and falsy values
2. Why `===` is usually safer than `==`
3. How to think clearly about `if/else`, ternaries, `switch`, and short-circuiting
4. When `??` is a better choice than `||`
5. How optional chaining helps avoid runtime errors

These topics seem simple at first, but they are behind a lot of production bugs. Many issues come from accidentally treating valid values like `0`, `false`, or an empty string as “missing.”

---

#### Truthy and Falsy Values

In JavaScript, conditionals do not only work with `true` and `false`. Many other values are treated as either truthy or falsy.

These are the main falsy values:

```javascript
false;
0 - 0;
0n;
("");
null;
undefined;
NaN;
```

Everything else is truthy.

That means this will run:

```javascript
if ("hello") {
  console.log("runs");
}
```

Because a non-empty string is truthy.

But this will not:

```javascript
if ("") {
  console.log("runs");
}
```

Because an empty string is falsy.

One important reminder: empty arrays and empty objects are still truthy.

```javascript
console.log(Boolean([])); // true
console.log(Boolean({})); // true
```

That surprises a lot of people at first.

---

#### Equality: `==` vs `===`

JavaScript gives us two common ways to compare values.

Strict equality, `===`, compares both value and type.

```javascript
console.log(5 === 5); // true
console.log(5 === "5"); // false
```

Loose equality, `==`, allows type coercion.

```javascript
console.log(5 == "5"); // true
```

That may look convenient, but it often creates confusing results:

```javascript
console.log(false == 0); // true
console.log("" == 0); // true
console.log(null == undefined); // true
```

This is why `===` is usually preferred in production code. It is stricter, more predictable, and easier to reason about quickly.

A good rule is:

- use `===` by default
- avoid `==` unless you have a very specific reason

---

#### Why `===` Is Preferred in Production Code

The biggest reason `===` is preferred is predictability.

With `===`, JavaScript does not silently convert values behind the scenes. That means your code is easier to read and less likely to surprise you later.

For example:

```javascript
console.log(false === 0); // false
```

This is much easier to reason about than:

```javascript
console.log(false == 0); // true
```

In production code, clarity usually matters more than clever shortcuts.

---

#### Control Flow Refresher

JavaScript gives us several ways to control decision-making in code:

- `if / else`
- ternary operator
- `switch`
- logical OR `||`
- logical AND `&&`
- nullish coalescing `??`
- optional chaining `?.`

Each one has a place, but the key is understanding what problem each one is solving.

#### `if / else`

This is still the clearest tool when logic has multiple steps.

```javascript
const age = 20;

if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
```

#### Ternary

A ternary is useful when you want a compact expression.

```javascript
const status = age >= 18 ? "adult" : "minor";
console.log(status);
```

It is best when the condition is simple. If the logic gets too nested, `if / else` is usually easier to read.

#### `switch`

A `switch` can be a nice fit when one value can map to several known cases.

```javascript
const role = "admin";

switch (role) {
  case "admin":
    console.log("Has full access");
    break;
  case "editor":
    console.log("Can edit content");
    break;
  default:
    console.log("Limited access");
}
```

---

#### Understanding `||`

The `||` operator is often used for fallback values.

A helpful mental model is this:

`||` says: “If the value on the left is falsy, use the value on the right.”

```javascript
console.log("" || "fallback"); // "fallback"
console.log(0 || 100); // 100
console.log(false || true); // true
console.log(null || "default"); // "default"
console.log(undefined || "default"); // "default"
```

This can be useful, but it can also be dangerous.

The reason is that `||` does not only replace missing values like `null` or `undefined`. It also replaces valid falsy values like:

- `0`
- `false`
- `""`

That is where bugs often happen.

---

#### Understanding `??`

The `??` operator is called the nullish coalescing operator.

Its mental model is narrower:

`??` says: “Only use the value on the right if the value on the left is `null` or `undefined`.”

```javascript
console.log("" ?? "fallback"); // ""
console.log(0 ?? 100); // 0
console.log(false ?? true); // false
console.log(null ?? "default"); // "default"
console.log(undefined ?? "default"); // "default"
```

This is often much safer in production code because it preserves valid falsy values.

That is the key difference:

- `||` cares about falsy values
- `??` cares only about missing values

---

#### When `??` Beats `||`

A simple question helps here:

Do I want a fallback for any falsy value, or only for missing values?

If you want a fallback for all falsy values, `||` may be okay.

If you only want a fallback when the value is actually missing, `??` is usually better.

For example:

```javascript
const count = 0;

console.log(count || 10); // 10
console.log(count ?? 10); // 0
```

If `0` is a real count, then `??` is clearly the better choice.

The same is true for booleans:

```javascript
const isAdmin = false;

console.log(isAdmin || true); // true
console.log(isAdmin ?? true); // false
```

If `false` is the real value, then `||` incorrectly replaces it.

This is why `??` is often a better default for API data, configuration values, counters, totals, and boolean flags.

---

#### Optional Chaining

Optional chaining helps us safely access nested properties without crashing.

For example:

```javascript
const user1 = {
  profile: {
    name: "Alex",
  },
};

const user2 = {};

console.log(user1.profile?.name); // "Alex"
console.log(user2.profile?.name); // undefined
```

Without optional chaining, trying to access a missing property could throw an error.

```javascript
// console.log(user2.profile.name); // TypeError
```

A useful reminder is that optional chaining only protects the part where you use it.

Safer:

```javascript
user?.profile?.name;
```

Less safe:

```javascript
user?.profile.name;
```

If `profile` is missing in the second example, the code can still fail.

---

#### A Small Input Normalizer Example

One of today’s exercises was to build a small function that safely handles empty strings, `null`, `undefined`, and `0`.

A naive version might look like this:

```javascript
function normalizeInput(value) {
  return value || "default";
}
```

That looks simple, but it has a problem:

```javascript
console.log(normalizeInput(0)); // "default"
```

If `0` is a valid value, this is wrong.

A safer version is:

```javascript
function normalizeInput(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }

  return value ?? null;
}
```

And when tested:

```javascript
console.log(normalizeInput("   hello   ")); // "hello"
console.log(normalizeInput("")); // null
console.log(normalizeInput("   ")); // null
console.log(normalizeInput(null)); // null
console.log(normalizeInput(undefined)); // null
console.log(normalizeInput(0)); // 0
console.log(normalizeInput(false)); // false
```

This is much safer because it preserves valid falsy values instead of throwing them away.

---

#### Common Beginner Mistakes to Avoid

#### 1. Treating all falsy values as missing

Not all falsy values are errors or empty data. `0` and `false` are often perfectly valid.

#### 2. Using `||` when `??` is the better fit

This is one of the most common causes of subtle bugs with counts, booleans, and API response values.

#### 3. Using `==` because it feels shorter

It is shorter, but it is usually less predictable. `===` is easier to trust in real code.

#### 4. Forgetting empty arrays and objects are truthy

This can cause confusion in conditionals.

```javascript
if ([]) {
  console.log("this runs");
}
```

This runs.

#### 5. Forgetting optional chaining only protects one step

If you need multiple safe steps, you usually need multiple `?.` operators.

---

#### Why This Matters in Angular

This topic shows up everywhere in Angular and frontend work.

It matters when:

- rendering optional API data
- showing fallback values in templates
- preserving legitimate values like `0`
- normalizing form input
- working with nested response objects
- writing safe component logic

Examples include:

- `user?.profile?.name`
- preserving `0` in totals or counters
- avoiding accidental fallbacks for `false`
- safely handling partial API responses

These are exactly the kinds of small JavaScript details that make production frontend code more reliable.

---

#### Final Takeaway

My biggest takeaway from this refresher is that JavaScript control flow becomes much easier when I stop thinking in vague terms like “empty” and start thinking more precisely.

- falsy does not always mean missing
- `===` is usually safer than `==`
- `||` is for falsy fallback behavior
- `??` is for nullish fallback behavior
- optional chaining makes nested property access much safer

The more clearly I understand those differences, the fewer bugs I will create when handling real data in frontend applications.
