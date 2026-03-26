---
title: "JavaScript Basics: Weekly Review and Explanation Checkpoint"
description: "A reflective refresher on reviewing JavaScript fundamentals from the first week, including weak spots, corrected examples, and how to turn review into real understanding."
published: true
datePublished: "March 25, 2026"
picture: "assets/posts/two.jpg"
---

### JavaScript Basics: Weekly Review and Explanation Checkpoint

March 25, 2026

In today’s article, I wanted to do something different from the earlier daily lessons.

Instead of focusing on a brand new JavaScript topic, I used this session as a weekly review and explanation checkpoint. The goal was to look back at everything I studied in the first week, identify what I could already explain well, and be honest about what still needed repetition.

That honesty matters.

A review day is not just about proving what I know. It is about exposing weak spots before they become bigger problems later. I want to be able to look back on posts like this in a few months and see not only what I learned, but also where I was still confused and how I worked through it.

This week covered a lot of important JavaScript foundations:

1. primitive values vs reference values
2. scope, hoisting, and the Temporal Dead Zone
3. truthy/falsy values and equality
4. functions, arrow functions, lexical scope, and `this`
5. array and object methods
6. a deeper drill session with `reduce` and `sort`

For this review session, I tried to rewrite several exercises from memory. Some of them went well. Some of them reminded me that I still need more reps.

That is exactly what a good review session should do.

---

#### How I Think a Weekly Review Should Work

If I were teaching someone how to review the first week of JavaScript fundamentals, I would suggest this approach:

1. pick a few core topics from memory
2. rewrite examples without looking at old notes
3. explain what the code is doing out loud
4. check where the mental model breaks down
5. fix the examples and make them easier to read

The point is not to read the material again passively.

The point is to ask:

> Can I still write and explain this without help?

If the answer is no, that is not failure. That is the exact spot where review is working.

---

#### The 10 JavaScript Ideas I Want Automatic Recall On

After the first six days, these are the JavaScript ideas I most want to know without hesitation:

1. Primitives are copied by value, while objects and arrays are handled through references.
2. Spread syntax only creates a shallow copy.
3. `let` and `const` are block-scoped, while `var` is function-scoped.
4. `var`, `let`, and `const` are all hoisted, but they behave differently.
5. `===` is safer than `==` because it avoids coercion.
6. `??` is often better than `||` when I want to preserve valid falsy values like `0` and `false`.
7. Arrow functions do not create their own `this`.
8. Lexical scope means variables are resolved based on where code is written.
9. `map`, `filter`, `find`, `some`, `every`, and `reduce` each have a different purpose.
10. `map` is for transformation, while `forEach` is usually for side effects.

That is a strong list for a first week, and it gives me a clear target for what I want automatic recall on.

---

#### What I Rewrote Correctly

Some of the review exercises went well, which was encouraging.

One area that felt solid was primitive values vs references.

```javascript
let count = 5;
let copiedCount = count;
copiedCount += 6;

console.log(count); // 5
console.log(copiedCount); // 11

const ref = { foo: "bar", face: "happy" };
const ref2 = ref;
ref2.face = "sad";

console.log(ref.face); // "sad"
```

This still feels like one of the most important JavaScript fundamentals to understand. Primitive values are copied independently, while object variables can end up pointing to the same underlying object.

I also felt reasonably good about scope and the Temporal Dead Zone:

```javascript
if (true) {
  var hi = "hello";
}
console.log(hi); // "hello"

if (true) {
  let bye = "bye";
}
// console.log(bye); // ReferenceError

// console.log(error1); // ReferenceError
let error1 = "no";
```

This review reminded me that I do understand the basic difference:

- `var` escapes the block
- `let` does not
- accessing `let` before declaration triggers a TDZ error

That part is starting to feel more stable.

---

#### Where I Still Needed More Practice

The review also made it obvious where I still needed more repetition.

The biggest weak spots were:

- writing a clean normalizer function with `??` and `||`
- showing `this` correctly with arrow functions
- remembering the simplest and clearest syntax for array methods like `map`, `filter`, `find`, `some`, and `every`

That was actually helpful to discover.

It would have been easy to assume I understood these topics because I had read and discussed them recently. But writing them from memory showed me exactly where the concepts still felt fragile.

That is why I think review days are so valuable.

---

#### Fixing My `??` and `||` Normalizer Example

In one of my review exercises, I wanted to write a normalizer function that:

- turns `null` and `undefined` into a fallback
- preserves `0`
- preserves `false`

My first attempt was not very clear:

```javascript
function normit(thing) {
  return thing ?? (thing || 0);
}
```

The reason this was not a great solution is that it mixed `??` and `||` in a way that made the intent harder to understand.

The cleaner solution is simply:

```javascript
function normalize(value) {
  return value ?? "fallback";
}
```

This works because `??` only falls back when the value is `null` or `undefined`.

So:

```javascript
console.log(normalize(null)); // "fallback"
console.log(normalize(undefined)); // "fallback"
console.log(normalize(0)); // 0
console.log(normalize(false)); // false
console.log(normalize("")); // ""
```

That is exactly what I wanted.

This was a good reminder that when I know the goal clearly, the simplest solution is often the best one.

The real mental model I want to remember is:

- `||` falls back for any falsy value
- `??` falls back only for `null` or `undefined`

That is one I still want more reps with.

---

#### Fixing My Arrow Function and `this` Example

Another area where I knew I needed more practice was `this`.

I wrote an object like this:

```javascript
let myObj = {
  sayHi: function () {
    console.log("HI");
  },
  sayBye: () => {
    console.log("Bye");
  },
};
```

That technically showed a regular function and an arrow function, but it did not really show the important part of the lesson, which is how `this` behaves differently.

A better review example is this:

```javascript
const myObj = {
  name: "Chris",

  sayHi: function () {
    console.log("Hi,", this.name);

    const later = () => {
      console.log("Still hi,", this.name);
    };

    later();
  },
};

myObj.sayHi();
```

This works because:

- `sayHi` is a regular method
- inside `sayHi`, `this` refers to `myObj`
- `later` is an arrow function
- the arrow function inherits the surrounding `this`

That means both logs use `"Chris"`.

The broken version looks like this:

```javascript
const brokenObj = {
  name: "Chris",
  sayBye: () => {
    console.log("Bye,", this.name);
  },
};

brokenObj.sayBye(); // usually undefined
```

This fails because the arrow function does not get method-style `this`.

That was one of the clearest review corrections for me.

The rule I want to keep is:

- use regular methods for object behavior
- use arrow functions for nested callbacks

---

#### Fixing My Array Method Examples

Array methods were another area where I could feel that I understood the ideas better than I remembered the syntax.

That is normal, but it also means I need more repetition.

My original review attempts for `map`, `filter`, and `find` were too complicated or incorrect for what I was trying to demonstrate. A better review is to go back to the clearest possible examples.

Here is the version I want to remember.

```javascript
const nums = [1, 3, 55, 33, 10];

const mapped = nums.map((n) => n * 2);
console.log(mapped); // [2, 6, 110, 66, 20]

const filtered = nums.filter((n) => n > 10);
console.log(filtered); // [55, 33]

const found = nums.find((n) => n === 10);
console.log(found); // 10

const hasEven = nums.some((n) => n % 2 === 0);
console.log(hasEven); // true

const allPositive = nums.every((n) => n > 0);
console.log(allPositive); // true
```

This review helped me simplify the mental models again:

- `map` transforms each item
- `filter` keeps matching items
- `find` gets the first matching item
- `some` checks if at least one item matches
- `every` checks if all items match

That is the level of clarity I want before I try to write more complex examples.

---

#### Why Simpler Examples Are Better During Review

One thing I learned from this checkpoint is that review is not the time to show off.

Review is the time to make the concept as simple and as clear as possible.

If my `map` example is so complicated that I cannot explain it cleanly, then it is not helping me review the purpose of `map`.

If my `this` example does not actually use `this.name`, then it is not reinforcing the real lesson.

Simple examples are not a sign of weakness. They are usually a sign that I am trying to understand the concept cleanly.

That is something I want to remember when I keep reviewing in future weeks.

---

#### How I Would Teach Scope, Equality, and Array Methods to a Junior Developer

One of the explanation prompts for today was to teach JavaScript scope, equality, and array methods in a short, simple way.

If I were explaining it to a junior developer, I would say this:

JavaScript scope is about where variables can be accessed. Variables declared with `let` and `const` are block-scoped, which means they stay inside the block where they are declared. `var` is function-scoped, which is one reason it can be easier to misuse.

For equality, I usually prefer `===` because it checks both value and type and avoids confusing coercion rules. `==` can do automatic type conversion, which is why expressions like `false == 0` end up being true.

For array methods, I think in terms of intent. `map` transforms each item and returns a new array. `filter` keeps matching items. `find` returns the first matching item. `some` checks whether at least one item matches. `every` checks whether all items match. `reduce` combines many items into one final result.

That is the kind of explanation I want to be able to give naturally, without sounding memorized.

---

#### What I Want to Keep Practicing After This Review

If I were turning this review into a practical next-step list, it would be this:

1. write 5 tiny normalizer examples using `??` and `||`
2. write 3 `this` examples from memory:
   - regular method
   - arrow inside regular method
   - arrow as method
3. rewrite the five main array methods using the simplest possible examples

That would strengthen the exact areas where I felt shaky this week.

And honestly, that is encouraging.

It means I do not need “more JavaScript” in a vague way. I need more repetition on specific patterns.

That is a much better place to be.

The Obstacle is the way.

---

#### Why This Matters in Angular Later

Everything I reviewed this week feeds directly into Angular development.

Understanding references and shallow copies helps with state updates and change detection.

Scope, lexical scope, and `this` affect callbacks, subscriptions, and event handling.

Equality and fallback logic matter in templates, forms, and API handling.

Array methods matter constantly when transforming data for display.

So even though this was a “JavaScript review day,” it still feels very relevant to my Angular goal.

---

#### Final Takeaway

My biggest takeaway from this weekly review is that review works best when it is honest.

The goal is not to prove I already know everything. The goal is to find the exact places where my understanding is still weak and then strengthen them deliberately.

This week showed me that I am starting to build a solid foundation, but it also reminded me where I still need more reps:

- `??` vs `||`
- arrow functions and `this`
- clean recall of array method syntax

That is valuable information.

If I keep documenting both what clicked and what was still hard, I think these posts will become a really useful record of how my understanding grows over time.
