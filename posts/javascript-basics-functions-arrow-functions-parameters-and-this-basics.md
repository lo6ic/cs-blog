---
title: "JavaScript Basics: Functions, Arrow Functions, Parameters, and This Basics"
description: "A practical refresher on function declarations, function expressions, arrow functions, default parameters, rest/spread, lexical scope, and this."
published: true
datePublished: "March 22, 2026"
picture: "assets/posts/highlevel.jpg"
---

### JavaScript Basics: Functions, Arrow Functions, Parameters, and This Basics

March 22, 2026

In today’s article, I want to focus on one of the most important parts of JavaScript: functions.

This refresher covers:

1. Function declarations vs function expressions
2. Arrow functions and when they are useful
3. Default parameters
4. Rest and spread syntax
5. A first-pass understanding of `this`
6. Why arrow functions help in some places and create confusion in others

Functions are everywhere in JavaScript, TypeScript, Angular, RxJS, event handling, and interview questions. The goal is not just to use them, but to understand how they really behave.

---

#### Functions Are Reusable Behavior

A function is a reusable block of code that can take inputs, do some work, and return an output.

```javascript
function greet(name) {
  return `Hello, ${name}`;
}
```

That is the classic function style most developers start with.

Functions help us avoid repetition and make logic easier to reuse, test, and reason about.

---

#### Function Declarations vs Function Expressions

JavaScript gives us more than one way to create a function.

A function declaration looks like this:

```javascript
function add(a, b) {
  return a + b;
}
```

A function expression looks like this:

```javascript
const add = function (a, b) {
  return a + b;
};
```

Both create functions, but they are not exactly the same.

A function declaration is declared by name directly.

A function expression creates a function and stores it in a variable.

One key difference is hoisting.

Function declarations are hoisted more fully, which means they can usually be called before they appear in the file:

```javascript
sayHi();

function sayHi() {
  console.log("Hi");
}
```

But a function expression stored in a `const` or `let` follows normal variable rules, so it cannot be used before its declaration:

```javascript
// sayHi(); // ReferenceError

const sayHi = function () {
  console.log("Hi");
};
```

That does not mean one style is always better, but it is important to know they behave differently.

---

#### Arrow Functions

Arrow functions are a shorter way to write functions.

```javascript
const add = (a, b) => {
  return a + b;
};
```

If the function body is just one expression, it can be shortened further:

```javascript
const add = (a, b) => a + b;
```

If there is exactly one parameter, the parentheses can be omitted:

```javascript
const square = x => x * x;
```

If there are zero or multiple parameters, parentheses are required:

```javascript
const getRandom = () => Math.random();
const multiply = (a, b) => a * b;
```

Arrow functions are very common in modern JavaScript because they are concise and work especially well for callbacks.

---

#### What Problem Arrow Functions Solve

At first glance, arrow functions just look shorter. That is true, but it is not the most important reason they exist.

Their bigger benefit is how they handle `this`.

Regular functions can have their own `this` depending on how they are called. That can cause confusion in nested callbacks.

Arrow functions do not create their own `this`. Instead, they inherit `this` from the surrounding lexical scope.

That makes them very useful when writing callbacks inside object methods, event handlers, or asynchronous code.

For example:

```javascript
const counter = {
  count: 0,
  incrementLater() {
    setTimeout(() => {
      this.count++;
      console.log(this.count);
    }, 100);
  },
};

counter.incrementLater();
```

In this example, the arrow function keeps the `this` value from `incrementLater`, which makes the code much easier to reason about.

That is one of the biggest practical problems arrow functions solve.

---

#### What Arrow Functions Do Not Change

Arrow functions do not replace every other kind of function.

They do not magically make all code better, and they are not the right choice everywhere.

Most importantly, they do not work well as object methods when you need method-style `this`.

For example:

```javascript
const user = {
  name: "Morgan",
  sayName: () => {
    console.log(this.name);
  },
};

user.sayName();
```

This usually does not print `"Morgan"`.

Why?

Because the arrow function does not bind `this` to `user`. It uses the surrounding `this` instead.

That is why a regular method is usually a better choice for object behavior:

```javascript
const user = {
  name: "Morgan",
  sayName() {
    console.log(this.name);
  },
};

user.sayName(); // "Morgan"
```

A simple rule that helps a lot is:

- use regular methods for object behavior
- use arrow functions for nested callbacks

---

#### A First-Pass Understanding of `this`

`this` is one of the most confusing topics in JavaScript, so I wanted to keep the first explanation simple.

A practical mental model is this:

A regular function often gets its `this` from how it is called.

For example:

```javascript
const person = {
  name: "Alex",
  greet() {
    console.log(this.name);
  },
};

person.greet(); // "Alex"
```

Here, `this` refers to `person` because the function was called as a method on that object.

Arrow functions behave differently.

They do not create their own `this`. Instead, they reuse the `this` from the surrounding scope.

That is why this works well:

```javascript
const team = {
  name: "Frontend",
  show() {
    const inner = () => {
      console.log(this.name);
    };

    inner();
  },
};

team.show(); // "Frontend"
```

The arrow function inherits `this` from the surrounding `show()` method.

But this does not work the same way:

```javascript
const team = {
  name: "Frontend",
  show: () => {
    console.log(this.name);
  },
};

team.show(); // usually undefined
```

That arrow function is not getting `this` from `team`. It is looking outward to the surrounding scope.

---

#### Lexical Scope

Understanding lexical scope helped make arrow functions much easier for me to understand.

Lexical scope means variables are resolved based on where code is written, not where it is called later.

JavaScript looks for a variable:

1. in the current scope
2. then in the outer scope
3. then the next outer scope
4. and so on

For example:

```javascript
const outerValue = "outside";

function showValue() {
  console.log(outerValue);
}

showValue(); // "outside"
```

The function can access `outerValue` because it was written in a place where that variable is in scope.

Arrow functions use this same “look outward” idea for `this`. That is why people often say arrow functions have lexical `this`.

That does not mean they copy `this`. It means they inherit the surrounding one.

---

#### Default Parameters

Default parameters let a function use a fallback value when an argument is missing.

```javascript
function greet(name = "Guest") {
  return `Hello, ${name}`;
}

console.log(greet()); // "Hello, Guest"
console.log(greet("Alex")); // "Hello, Alex"
```

This is much cleaner than older manual fallback patterns.

---

#### Rest Parameters

Rest parameters collect remaining arguments into an array.

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3)); // 6
```

Here, `...numbers` gathers all incoming arguments into an array called `numbers`.

Then `.reduce()` combines that array into one final result.

A simpler way to think about it is:

- `total` is the running sum
- `n` is the current number
- `0` is the starting value

So this:

```javascript
numbers.reduce((total, n) => total + n, 0);
```

basically means:

“Start at 0, then add each number into the running total.”

That same function could also be written more manually like this:

```javascript
function sum(...numbers) {
  let total = 0;

  for (const n of numbers) {
    total = total + n;
  }

  return total;
}
```

---

#### Spread Syntax

Spread syntax is closely related to rest syntax, but it does the opposite job.

Rest collects values into one array.

Spread expands values out.

For example:

```javascript
const baseNumbers = [1, 2, 3];
const copiedNumbers = [...baseNumbers, 4, 5];

console.log(copiedNumbers); // [1, 2, 3, 4, 5]
```

With objects, spread copies the outer layer of properties:

```javascript
const originalUser = {
  name: "Sam",
  address: {
    city: "Chicago",
  },
};

const copiedUser = { ...originalUser };
```

This is a shallow copy, which means nested objects are still shared.

That gave me a useful mental comparison:

- spread copies the outer layer of an object
- arrow functions capture the outer `this`

It is not a perfect one-to-one comparison, but it helped me build intuition.

---

#### Refactoring Normal Functions into Arrow Functions

One useful exercise, I found, was refactoring regular functions into arrow functions and checking whether behavior changed.

For simple standalone functions, behavior often stays the same:

```javascript
function double(x) {
  return x * 2;
}

const doubleArrow = (x) => x * 2;
```

Same result.

Another example:

```javascript
function formatName(first, last) {
  return `${first} ${last}`;
}

const formatNameArrow = (first, last) => `${first} ${last}`;
```

Again, same result.

But when `this` is involved, refactoring can change behavior:

```javascript
const person = {
  name: "Alex",
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

This works.

If it is changed to:

```javascript
const person = {
  name: "Alex",
  greet: () => `Hello, ${this.name}`,
};
```

then the behavior changes, because the arrow function does not get method-style `this`. It will get lexical-style `this` and look outward. Which in this case would be `undefined`.

That was one of the biggest takeaways from the lesson.

---

#### Common Beginner Mistakes to Avoid

#### 1. Thinking arrow functions are always better

They are useful, but they are not a universal replacement for every other function form.

#### 2. Using arrow functions as object methods without thinking about `this`

This is one of the most common gotchas in JavaScript.

#### 3. Confusing rest and spread

A simple rule is:

- rest collects
- spread expands

#### 4. Thinking arrow functions completely change how functions work

They mainly change syntax and `this` behavior. Functions still take inputs, do work, and return values.

#### 5. Thinking lexical scope means “one level only”

Lexical scope means JavaScript looks outward through surrounding scopes until it finds what it needs.

---

#### Why This Matters in Angular

This topic shows up constantly in Angular and TypeScript code.

It matters when working with:

- RxJS callbacks
- array methods like `map`, `filter`, and `reduce`
- timers and async logic
- component methods
- nested functions inside class methods
- event handlers
- safely preserving `this` inside callbacks

Arrow functions are everywhere in modern frontend code, but understanding when not to use them is just as important as understanding when to use them.

---

#### Final Takeaway

My biggest takeaway from this refresher is that arrow functions are not just shorter syntax.

They solve a real problem by inheriting `this` from the surrounding lexical scope, which makes callback code easier to reason about.

At the same time, they do not replace regular methods when method-style `this` is needed.

The clearest rule I took from this lesson is:

- use regular methods for object behavior
- use arrow functions for nested callback behavior

The more clearly I understand that distinction, the easier it becomes to read and write JavaScript without guessing.
