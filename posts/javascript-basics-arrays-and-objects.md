---
title: "JavaScript Basics: Arrays and Objects"
description: "A practical refresher on common array methods, object destructuring, shallow copying, and everyday data transformation patterns."
published: true
datePublished: "March 23, 2026"
picture: "assets/posts/cords.jpg"
---

### JavaScript Basics: Arrays and Objects

March 23, 2026

In today’s article, I wanted to refresh one of the most practical parts of JavaScript: working with arrays and objects.

This lesson focused on:

1. Common array methods like `push`, `pop`, `map`, `filter`, `reduce`, `find`, `some`, and `every`
2. Object destructuring
3. Shallow copying patterns with arrays and objects
4. Solving common data transformation problems cleanly

This topic matters because a huge amount of frontend work is really just safe, readable data transformation. Whether I am working with Angular components, API responses, dashboard data, or UI state, I am constantly mapping, filtering, grouping, and reshaping values.

---

#### Arrays Are Collections You Transform

Arrays are not just things to loop through. In modern JavaScript, they are usually collections of data that get transformed into something else.

For example:

```javascript
const prices = [10, 20, 30];
```

From there, I might want to:

- create a new list of taxed prices
- keep only expensive items
- total them
- find one matching item
- check if at least one or all items pass a condition

That is where array methods become so useful.

---

#### Quick Mental Models for Array Methods

Each array method has a different job, and learning their intent makes code much easier to read.

#### `push` and `pop`

These mutate the array directly.

- `push` adds to the end
- `pop` removes from the end

```javascript
const items = [1, 2];
items.push(3);
console.log(items); // [1, 2, 3]

items.pop();
console.log(items); // [1, 2]
```

These are straightforward, but it is important to remember that they change the original array.

---

#### `map`

`map` transforms each item and returns a new array.

A good mental model is:

> same number of items, different form

```javascript
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);

console.log(doubled); // [2, 4, 6]
```

`map` is one of the clearest ways to express data transformation.

---

#### `filter`

`filter` keeps only the items that match a condition.

```javascript
const nums = [1, 2, 3, 4];
const evens = nums.filter((n) => n % 2 === 0);

console.log(evens); // [2, 4]
```

Unlike `map`, `filter` may return fewer items than the original array.

---

#### `reduce`

`reduce` takes many items and combines them into one final result.

A simple mental model is:

> many in, one out

```javascript
const nums = [1, 2, 3];
const total = nums.reduce((sum, n) => sum + n, 0);

console.log(total); // 6
```

In that example:

- `sum` is the running total
- `n` is the current number
- `0` is the starting value

So the function is basically saying:

“Start at 0, then add each number into the running total.”

`reduce` is powerful because the final result does not have to be a number. It can also build objects, arrays, grouped totals, and other derived structures.

---

#### `find`

`find` returns the first matching item.

```javascript
const users = [{ id: 1 }, { id: 2 }];
const user = users.find((u) => u.id === 2);

console.log(user); // { id: 2 }
```

This is different from `filter`.

- `find` returns one item or `undefined`
- `filter` returns an array

That distinction is easy to mix up at first.

---

#### `some` and `every`

These methods ask yes/no questions about an array.

`some` asks:

> Does at least one item match?

```javascript
const nums = [1, 2, 3];
console.log(nums.some((n) => n % 2 === 0)); // true
```

`every` asks:

> Do all items match?

```javascript
const nums = [2, 4, 6];
console.log(nums.every((n) => n % 2 === 0)); // true
```

These methods are great when the answer should be a boolean instead of a transformed list.

---

#### Why `map` Feels Different from `forEach`

My understanding is that `map` feels different because it communicates transformation.

It says:

“I am taking one array and turning it into another array.”

For example:

```javascript
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);

console.log(doubled); // [2, 4, 6]
```

`forEach` is different because it is usually about side effects.

It says:

“I want to do something for each item.”

```javascript
const nums = [1, 2, 3];
nums.forEach((n) => console.log(n));
```

That might be logging, updating something external, or calling another function.

A big difference is that `map` returns a new array, while `forEach` returns `undefined`.

So `map` often sounds stronger in interview answers because it expresses intent more clearly. It tells the interviewer I am transforming data, not just looping.

---

#### Object Destructuring

Object destructuring is a cleaner way to pull values out of an object.

```javascript
const user = {
  name: "Alex",
  isActive: true,
};

const { name, isActive } = user;
```

This is often easier to read than repeating `user.name` and `user.isActive`.

This is basically doing this:

```javascript
const name = user.name;
const isActive = user.isActive;
```

Destructuring can also rename variables:

```javascript
const { name: userName } = user;
```

Similar to:

```javascript
const userName = user.name;
```

And provide default values:

```javascript
const { role = "guest" } = user;
```

This is creating a new `role` const with the default as "guest".

That makes it really useful when dealing with configuration, props, API data, or optional values.

---

#### Shallow Copying Patterns

For arrays, a common shallow copy pattern is:

```javascript
const original = [1, 2, 3];
const copy = [...original];
```

For objects:

```javascript
const originalUser = { name: "Alex", age: 30 };
const copyUser = { ...originalUser };
```

These are useful, but they are only shallow copies.

That means nested objects are still shared.

```javascript
const user = {
  name: "Alex",
  address: {
    city: "Chicago",
  },
};

const copied = { ...user };
copied.address.city = "Boston";

console.log(user.address.city); // "Boston"
```

That behavior matters a lot in frontend work because it can cause mutation bugs if I assume spread makes a full deep copy.

---

#### Common Data Drills

One of the most useful parts of today’s lesson is solving a few realistic data transformation drills.

#### Dedupe a List

```javascript
const tags = ["angular", "rxjs", "angular", "typescript", "rxjs"];
const uniqueTags = [...new Set(tags)];

console.log(uniqueTags); // ["angular", "rxjs", "typescript"]
```

A `Set` is a built-in JavaScript collection that only keeps unique values. The spread operator makes sure a new array is created and returned.

This is a clean way to remove duplicates from a list.

---

#### Group Totals

```javascript
const orders = [
  { category: "food", amount: 20 },
  { category: "travel", amount: 50 },
  { category: "food", amount: 15 },
];

const totalsByCategory = orders.reduce((acc, order) => {
  acc[order.category] = (acc[order.category] ?? 0) + order.amount;
  return acc;
}, {});

console.log(totalsByCategory); // { food: 35, travel: 50 }
```

This is a strong real-world example of `reduce` building an object instead of just a number.

---

#### Filter Active Items

```javascript
const items = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true },
];

const activeItems = items.filter((item) => item.active);
console.log(activeItems);
```

This is the kind of thing that shows up constantly in UI code.

---

#### Merge Config

```javascript
const defaultConfig = {
  theme: "light",
  pageSize: 10,
};

const userConfig = {
  pageSize: 25,
};

const mergedConfig = {
  ...defaultConfig,
  ...userConfig,
};

console.log(mergedConfig); // { theme: "light", pageSize: 25 }
```

The later spread wins, which makes this pattern very useful for defaults plus overrides.

---

#### Safe Nested Reads

```javascript
const apiResponse = {
  user: {
    profile: {
      name: "Alex",
    },
  },
};

const userName = apiResponse.user?.profile?.name ?? "Unknown";
console.log(userName);
```

This combines optional chaining and nullish coalescing to safely read nested values.

That is a very practical production pattern.

---

#### Common Beginner Mistakes to Avoid

#### 1. Using `forEach` when `map` is the clearer tool

If I want a transformed array, `map` usually communicates intent better.

#### 2. Forgetting that `filter` always returns an array

Even if only one item matches, `filter` still returns an array.

#### 3. Forgetting that `find` can return `undefined`

That matters when reading properties from the result.

#### 4. Overusing `reduce`

`reduce` is powerful, but sometimes `map` or `filter` is much clearer.

#### 5. Assuming spread does a deep copy

It does not. It only copies the outer layer.

---

#### Why This Matters in Angular

This topic shows up constantly in Angular and frontend work.

It matters when:

- transforming API responses
- filtering active records for display
- grouping totals for dashboards
- building derived UI state
- merging configuration objects
- safely reading nested response data
- immutably updating arrays and objects

A lot of “real coding” is really data transformation, so getting comfortable with these methods makes frontend development much more natural.

---

#### Final Takeaway

My biggest takeaway from this refresher is that array and object methods are really about intent.

- `map` means transform
- `filter` means keep matching items
- `reduce` means combine into one result
- `find` means get the first match
- `some` and `every` answer yes/no questions
- destructuring makes object access cleaner
- spread copying is useful but still shallow

The more clearly I understand the purpose of each one, the easier it becomes to write readable JavaScript instead of just “looping over stuff.”
