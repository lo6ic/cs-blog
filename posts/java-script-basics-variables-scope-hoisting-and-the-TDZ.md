---
title: "JavaScript Basics: Variables, Scope, Hoisting, and the Temporal Dead Zone"
description: "A practical refresher on var vs let vs const, block scope, hoisting, and why temporal dead zone errors happen."
published: true
datePublished: "March 20, 2026"
picture: "assets/posts/backshift.jpg"
---

### JavaScript Basics: Variables, Scope, Hoisting, and the Temporal Dead Zone

March 20, 2026

In today’s article, I want to focus on four foundational JavaScript ideas:

1. How `var`, `let`, and `const` behave differently
2. The difference between function scope and block scope
3. What hoisting actually means
4. Why Temporal Dead Zone errors happen

These ideas matter much more than they first appear to. They affect debugging, loop behavior, closures, async code, and overall confidence when reasoning through JavaScript interview questions.

---

#### Variables Are Not All the Same

JavaScript gives us three main ways to declare variables:

```javascript
var a = 1;
let b = 2;
const c = 3;
```

At a quick glance they can seem interchangeable, but they behave differently in important ways.

- `var` is function-scoped
- `let` is block-scoped
- `const` is block-scoped and cannot be reassigned

Understanding those differences makes JavaScript feel much more predictable.

---

#### Function Scope vs Block Scope

One of the biggest differences between `var` and `let`/`const` is scope.

A variable declared with `var` belongs to the nearest function, not the nearest block.

```javascript
if (true) {
  var x = 10;
}

console.log(x); // 10
```

Even though `x` was declared inside the `if` block, it is still available outside of it. That can lead to confusing bugs because the variable “escapes” the block.

Now compare that with `let` and `const`:

```javascript
if (true) {
  let y = 20;
  const z = 30;
}

// console.log(y); // ReferenceError
// console.log(z); // ReferenceError
```

These variables stay inside the block where they were declared. That is usually much safer because it limits where the value can be accessed or changed.

---

#### Hoisting

Hoisting is one of those JavaScript topics that is often explained in a confusing way.

A simple mental model is this:

JavaScript processes declarations before it executes the code.

However, not every declaration behaves the same way after that processing.

#### `var` Hoisting

Variables declared with `var` are hoisted and initialized with `undefined`.

```javascript
console.log(a); // undefined
var a = 5;
```

This behaves roughly like:

```javascript
var a;
console.log(a); // undefined
a = 5;
```

That is why reading a `var` variable before its assignment does not throw an error.

#### `let` and `const` Hoisting

`let` and `const` are also hoisted, but they are not initialized the same way as `var`.

```javascript
// console.log(b); // ReferenceError
let b = 5;

// console.log(c); // ReferenceError
const c = 10;
```

Instead of quietly giving `undefined`, JavaScript throws an error if you try to access them too early.

That behavior leads directly to the Temporal Dead Zone.

---

#### The Temporal Dead Zone

The Temporal Dead Zone, usually called the TDZ, is the period between entering a scope and the moment a `let` or `const` variable is declared.

During that time, the variable exists in the scope, but it cannot be accessed yet.

```javascript
{
  // TDZ starts here
  // console.log(count); // ReferenceError
  let count = 1;
}
```

A simple way to think about it is:

- the scope exists
- the variable name exists
- but JavaScript will not let you use it yet

This is actually helpful because it catches mistakes earlier instead of silently returning `undefined`.

---

#### Why `let` and `const` Feel Safer Than `var`

This is one of the most common takeaways from this topic.

`let` and `const` usually feel safer than `var` because they behave more predictably.

They are block-scoped, so they stay inside the `if`, `for`, or other block where they belong. That reduces accidental access and side effects.

They also help catch errors earlier. If you try to access them before declaration, JavaScript throws an error instead of silently giving you `undefined`.

That makes bugs easier to spot.

`let` also behaves better in loops, especially when callbacks are involved.

---

#### The Classic Loop Example

This is one of the most famous `var` vs `let` examples:

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var loop:", i), 0);
}
```

This logs:

```javascript
3;
3;
3;
```

Why?

Because `var` creates one shared `i` for the whole loop. By the time the callback runs, the loop is already finished and `i` is now `3`.

Now compare that with `let`:

```javascript
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let loop:", j), 0);
}
```

This logs:

```javascript
0;
1;
2;
```

That happens because `let` creates a new binding for each loop iteration. Each callback closes over its own separate value.

This is one of the clearest examples of why `let` feels safer and more intuitive.

---

#### `const` Does Not Mean Immutable

This is an important detail that trips people up.

`const` means the variable cannot be reassigned to a new value. It does not mean the contents of an object become frozen or immutable.

```javascript
const user = { name: "Sam" };
user.name = "Jordan"; // allowed

console.log(user);
```

This works because the variable `user` still points to the same object.

But this would fail:

```javascript
const user = { name: "Sam" };

// user = { name: "Jordan" }; // TypeError
```

So a useful rule is:

- `const` prevents reassignment
- it does not automatically prevent mutation

---

#### Coding Example Review

Here is a useful scratch file for experimenting with scope and hoisting:

```javascript
console.log("1.", a);
var a = 10;

// console.log("2.", b);
// let b = 20;

// console.log("3.", c);
// const c = 30;

if (true) {
  var functionScoped = "I escape the block";
  let blockScoped = "I stay in the block";
  const alsoBlockScoped = "Me too";

  console.log("4.", functionScoped);
  console.log("5.", blockScoped);
  console.log("6.", alsoBlockScoped);
}

console.log("7.", functionScoped);
// console.log("8.", blockScoped);
// console.log("9.", alsoBlockScoped);

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("10. var loop:", i), 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("11. let loop:", j), 0);
}

const person = { name: "Alex" };
person.name = "Jordan";
console.log("12.", person);

function testVar() {
  if (true) {
    var inside = "inside";
  }
  console.log("13.", inside);
}

function testLet() {
  if (true) {
    let insideLet = "inside let";
    console.log("14.", insideLet);
  }

  // console.log("15.", insideLet);
}

testVar();
testLet();
```

When reviewing examples like this, the best habit is to predict the output first and only then run the code.

That is what builds real understanding.

---

#### Common Beginner Mistakes to Avoid

#### 1. Thinking hoisting means code is literally moved

That is a simplification. A better way to think about it is that declarations are processed before execution, but different declarations get different initialization behavior.

#### 2. Thinking `let` and `const` are not hoisted

They are hoisted. The difference is that they stay unavailable in the Temporal Dead Zone until declaration.

#### 3. Thinking `const` means immutable

It only means the variable cannot be reassigned. Objects and arrays declared with `const` can still be mutated unless you use other techniques to prevent that.

#### 4. Forgetting loop scope behavior

This comes up all the time in interviews. If you can clearly explain why `var` prints `3, 3, 3` and `let` prints `0, 1, 2`, you already understand something very useful.

---

#### Why This Matters in Angular

Even though this is a JavaScript fundamentals topic, it shows up in frontend work constantly.

Understanding scope and closures helps with:

- callbacks
- subscriptions
- async behavior
- event handlers
- loops inside components
- debugging weird shared-variable behavior

This also improves your confidence when reading TypeScript and Angular code, because modern Angular projects rely heavily on predictable block-scoped variables.

---

#### Final Takeaway

My biggest takeaway from this refresher is that `let` and `const` feel safer not because they are newer, but because they are more predictable.

- `var` is function-scoped and easier to misuse
- `let` and `const` are block-scoped
- `let` and `const` protect against early access with the Temporal Dead Zone
- `let` behaves better in loops with callbacks
- `const` prevents reassignment, but not object mutation

The more clearly I understand these differences, the easier it becomes to reason about real code without guessing.
