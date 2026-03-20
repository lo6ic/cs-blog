---
title: "JavaScript Basics: Primitives, Object References, and Mutation"
description: "A practical refresher on JavaScript primitives, object references, and why mutation causes bugs."
published: true
datePublished: "March 19, 2026"
picture: "assets/posts/two.jpg"
---

## JavaScript Basics: Primitives, Object References, and Mutation

March 19, 2026

In today’s article, I want to focus on three foundational JavaScript ideas:

1. How JavaScript stores and works with values
2. Why primitives behave differently from objects
3. Why mutation causes so many bugs in real applications, including Angular apps

These ideas sound basic at first, but they are extremely important. They affect how we reason about state, debugging, equality, copying data, and predictable UI updates.

---

### JavaScript Values

When thinking about JavaScript values, it helps to separate them into two categories:

- **primitive values**
- **reference values** like objects and arrays

JavaScript stores primitive values as the actual value itself. Objects, arrays, and functions are different: variables hold a reference to the underlying object in memory.

### JavaScript Primitives

These are primitive values in JavaScript:

- string
- number
- boolean
- null
- undefined
- symbol
- bigint

These are **not** primitives:

- objects
- arrays
- functions
- dates
- maps/sets

This distinction matters because it affects how assignment works.

When assigning a primitive, JavaScript copies the value.

When assigning an object, JavaScript copies the reference value, not a brand new object.

---

### Primitive Example

When assigning one primitive variable to another, the value is copied.

```javascript
let a = 5;
let b = a;
b = 10;
```

In this example:

- `a` starts with the value `5`
- `b` gets its own copy of that value
- when `b` is reassigned to `10`, `a` stays `5`

That is because primitives are independent values after assignment.

---

### Object Reference Example

Objects behave differently.

```javascript
const person1 = { name: "Alex" };
const person2 = person1;
person2.name = "Jordan";
```

This is where things get interesting.

After this runs, `person1.name` is also `"Jordan"`.

Why?

Because `person1` does not contain the object directly in the same way a primitive contains its value. Instead, it holds a reference to that object. When we do:

```javascript
const person2 = person1;
```

`person2` now holds the same reference. Both variables point to the same underlying object.

So when we mutate the object through `person2`, we are still changing the same object that `person1` points to.

---

### Why Mutation Causes Bugs

A mutation bug happens when shared data is changed unexpectedly.

For example:

- one part of the app changes an object
- another part of the app is also using that same object
- now both places see the changed data, even if that was not intended

This becomes a big deal in frontend apps because shared state can lead to:

- hard-to-track side effects
- confusing bugs
- unexpected UI behavior
- brittle code that is harder to reason about

This is especially important in Angular when working with:

- component state
- inputs
- signals
- RxJS streams
- change detection
- immutable update patterns

---

### Coding Examples

Save this into a `.js` file and inspect the console output:

```javascript
console.log("--- PRIMITIVES ---");

const str = "hello";
const num = 42;
const bool = true;
const nothing = null;
let notAssigned;
const unique = Symbol("id");
const big = 9007199254740993n;

console.log(typeof str, str);
console.log(typeof num, num);
console.log(typeof bool, bool);
console.log(typeof nothing, nothing); // weird historical JS behavior
console.log(typeof notAssigned, notAssigned);
console.log(typeof unique, unique);
console.log(typeof big, big);

console.log("\n--- PRIMITIVE COPY ---");

let a = 10;
let b = a;

console.log("before change:", { a, b });
b = 99;
console.log("after change:", { a, b });

console.log("\n--- OBJECT REFERENCE ---");

const person1 = { name: "Alice", age: 30 };
const person2 = person1;

console.log("before mutation:", { person1, person2 });
person2.age = 31;
console.log("after mutation:", { person1, person2 });

console.log("\n--- ARRAY REFERENCE ---");

const arr1 = [1, 2, 3];
const arr2 = arr1;

console.log("before push:", { arr1, arr2 });
arr2.push(4);
console.log("after push:", { arr1, arr2 });

console.log("\n--- SHALLOW COPY OBJECT ---");

const originalUser = { name: "Sam", address: { city: "Chicago" } };
const copiedUser = { ...originalUser };

console.log("before nested mutation:", { originalUser, copiedUser });
copiedUser.name = "Jordan";
copiedUser.address.city = "Boston";

console.log("after nested mutation:", { originalUser, copiedUser });

console.log("\n--- COMPARISONS ---");

console.log(5 === 5); // true
console.log("hi" === "hi"); // true

console.log({} === {}); // false
console.log([] === []); // false

const ref1 = { x: 1 };
const ref2 = ref1;
console.log(ref1 === ref2); // true
```

---

### Highlights to Pay Attention To

#### 1. `typeof null` is `"object"`

This is one of JavaScript’s famous historical quirks. `null` is not an object in the way we normally think about objects, but `typeof null` still returns `"object"` for legacy reasons.

#### 2. Primitive assignment copies the value

Changing `b` does not affect `a`.

#### 3. Object assignment copies the reference value

Changing `person2.age` also changes `person1.age` because both variables refer to the same object.

#### 4. Spread syntax is only a shallow copy

This part is very important:

```javascript
const copiedUser = { ...originalUser };
```

This creates a new top-level object, but nested objects are still shared.

So this line:

```javascript
copiedUser.name = "Jordan";
```

does **not** affect `originalUser.name`.

But this line:

```javascript
copiedUser.address.city = "Boston";
```

**does** affect `originalUser.address.city`.

That is because the nested `address` object is still shared between both objects.

---

### Safer Nested Copy Example

If you want to avoid that nested mutation bug, you need to copy the nested object too:

```javascript
const copiedUser = {
  ...originalUser,
  address: {
    ...originalUser.address,
    city: "Boston",
  },
};
```

This pattern is much safer because it creates a new `address` object instead of reusing the old one.

---

### Common Beginner Mistakes to Avoid

#### 1. Saying objects are “passed by reference”

This is common, but not the most precise phrasing.

A better way to say it is:

> JavaScript passes values. For objects, that value happens to be a reference.

That is more accurate.

#### 2. Thinking spread syntax does a deep clone

It does not. It only copies the first level.

#### 3. Assuming equality means “same shape”

For example:

```javascript
{ a: 1 } === { a: 1 } // false
```

Even though those objects look the same, they are different object references, so they are not strictly equal.

---

### Why This Matters in Angular

This topic matters a lot in Angular development.

If you do not understand value vs reference well, it becomes much harder to reason about:

- why shared state changes unexpectedly
- why a component re-renders or does not re-render
- how to safely update state
- how `OnPush` change detection works
- why immutable update patterns are helpful

This is one of those JavaScript fundamentals that directly improves frontend architecture and debugging skills.

---

### Final Takeaway

The biggest lesson for me from this refresher is this:

- primitives behave like independent values after assignment
- objects and arrays can easily become shared state through references
- mutation bugs often happen when we forget that two variables may still point to the same underlying object

Understanding this makes JavaScript feel much less mysterious and makes it easier to write safer frontend code.
