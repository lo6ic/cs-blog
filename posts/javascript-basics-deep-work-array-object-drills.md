---
title: "JavaScript Basics: Deep Work Session with Array and Object Drills"
description: "A practical refresher on array and object drills through a tiny expense summary project, with extra focus on understanding reduce and sort."
published: true
datePublished: "March 24, 2026"
picture: "assets/posts/two.jpg"
---

### JavaScript Basics: Deep Work Session with Array and Object Drills

March 24, 2026

In today’s article, I wanted to do something a little different.

Instead of learning a bunch of brand new syntax, I used this session as a deep work refresher. The goal was to take the JavaScript array and object basics I have already reviewed and start turning them into muscle memory.

This lesson focused on building a tiny console-based expense summary that:

1. totals expenses by category
2. sorts categories from highest to lowest
3. prints clean readable output

That may sound simple, but it uses several very practical JavaScript patterns that show up constantly in frontend work:

- arrays of objects
- `reduce`
- `Object.entries`
- `map`
- `sort`
- `forEach`
- optional fallback values with `??`

This kind of drill is exactly the kind of thing that helps move knowledge from “I’ve seen this before” to “I can actually use this.”

---

#### Why a Deep Work Session Matters

One thing I am realizing more and more is that reading syntax is not the same as owning it.

I can read about `reduce`, `map`, and object shaping all day, but if I do not actually build something with them, the knowledge stays shallow.

That is why a repetition day like this matters.

The point was not to discover ten new features. The point was to take a few familiar tools and apply them enough times that they start to feel natural.

That kind of repetition is what builds confidence for interviews and real coding work.

---

#### The Small Problem I Wanted to Solve

I started with expense data like this:

```javascript
const expenses = [
  { description: "Groceries", category: "Food", amount: 45 },
  { description: "Lunch", category: "Food", amount: 18 },
  { description: "Bus Pass", category: "Transport", amount: 30 },
  { description: "Gas", category: "Transport", amount: 55 },
  { description: "Netflix", category: "Entertainment", amount: 15 },
];
```

Then I wanted the output to look something like this:

```javascript
Expense Summary
---------------
Transport: $85
Food: $63
Entertainment: $15
```

To get there, the code needed to do a few clear steps:

1. loop through the expense array
2. total the amounts by category
3. convert the grouped object into something sortable
4. sort it from highest to lowest
5. print the output cleanly

This felt like a great exercise because it mirrors real frontend work. A lot of UI logic is basically: take an array of data, reshape it, and display the result clearly.

---

#### My Expense Summary Solution

Here is the version I ended up with:

```javascript
const expenses = [
  { description: "Groceries", category: "Food", amount: 45 },
  { description: "Lunch", category: "Food", amount: 18 },
  { description: "Bus Pass", category: "Transport", amount: 30 },
  { description: "Gas", category: "Transport", amount: 55 },
  { description: "Netflix", category: "Entertainment", amount: 15 },
];

function summarizeExpenses(expenses) {
  if (expenses.length === 0) {
    console.log("No expenses found.");
    return;
  }

  const totalsByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
    return acc;
  }, {});

  const sortedTotals = Object.entries(totalsByCategory)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const grandTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  console.log("Expense Summary");
  console.log("---------------");

  sortedTotals.forEach(({ category, total }) => {
    console.log(`${category}: $${total}`);
  });

  console.log("---------------");
  console.log(`Total: $${grandTotal}`);
}

summarizeExpenses(expenses);
```

---

#### Walking Through the Code Step by Step

If I were walking a teammate through this code, I would explain it like this.

I start with an array of expense objects. Each expense has a description, a category, and an amount.

The first thing the function does is handle the empty-array case:

```javascript
if (expenses.length === 0) {
  console.log("No expenses found.");
  return;
}
```

I like that early guard because it keeps the rest of the function simpler and avoids doing extra work when there is no data.

After that, I use `reduce` to build an object of totals by category:

```javascript
const totalsByCategory = expenses.reduce((acc, expense) => {
  acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
  return acc;
}, {});
```

This gives me an object like:

```javascript
{
  Food: 63,
  Transport: 85,
  Entertainment: 15
}
```

Then I use `Object.entries()` to turn that object into an array of key-value pairs, because arrays are much easier to sort than plain objects.

```javascript
Object.entries(totalsByCategory);
```

That gives me something like:

```javascript
[
  ["Food", 63],
  ["Transport", 85],
  ["Entertainment", 15],
];
```

From there, I map those entries into objects that are a little easier to read:

```javascript
.map(([category, total]) => ({ category, total }))
```

Now the structure becomes:

```javascript
[
  { category: "Food", total: 63 },
  { category: "Transport", total: 85 },
  { category: "Entertainment", total: 15 },
];
```

After that, I sort the array in descending order by total:

```javascript
.sort((a, b) => b.total - a.total);
```

That gives me the categories from highest total to lowest total.

Then I calculate the grand total across all expenses:

```javascript
const grandTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
```

Finally, I print the output with `forEach`, because at that point I am not transforming data anymore. I am just performing a side effect by writing to the console.

---

#### A Closer Look at `reduce`

`reduce` was one of the methods I wanted to understand more deeply in this refresher, because it can feel confusing at first.

A simple mental model for `reduce` is:

> take many items and combine them into one final result

That final result could be:

- a number
- a string
- an object
- another array

In this lesson, I used it in two ways.

The first use was for grouping totals by category:

```javascript
const totalsByCategory = expenses.reduce((acc, expense) => {
  acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
  return acc;
}, {});
```

Here is how I think about the parameters:

- `acc` is the accumulator, or running result
- `expense` is the current expense item
- `{}` is the starting value for the accumulator

So `reduce` starts with an empty object:

```javascript
{
}
```

Then for each expense, it updates the correct category total.

If the current expense is:

```javascript
{ description: "Groceries", category: "Food", amount: 45 }
```

then this line:

```javascript
acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
```

becomes:

```javascript
acc["Food"] = (acc["Food"] ?? 0) + 45;
```

Since `acc["Food"]` does not exist yet, `?? 0` gives a safe starting value of `0`.

So now:

```javascript
acc["Food"] = 45;
```

Later, when another Food expense appears, it adds onto that existing total.

The second use of `reduce` was for the grand total:

```javascript
const grandTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
```

This one is easier to read at first:

- `sum` is the running total
- `expense` is the current item
- `0` is the starting value

So I read it like this:

> Start at 0, then add each expense amount into the running total.

One important thing that helped me is realizing that the callback parameters are not “default params.” They are arguments that `reduce` automatically passes into the callback when it runs.

---

#### A Closer Look at `sort`

`sort` was the other method I wanted to understand more clearly.

A simple mental model for `sort` is:

> compare two items and decide which one should come first

In my expense summary, I used:

```javascript
.sort((a, b) => b.total - a.total);
```

This sorts the category totals from highest to lowest.

The callback parameters work like this:

- `a` is one item being compared
- `b` is another item being compared

And the return value tells JavaScript how to order them.

A good quick rule is:

- ascending: `(a, b) => a - b`
- descending: `(a, b) => b - a`

For objects, I compare the specific property I care about:

```javascript
.sort((a, b) => b.total - a.total);
```

So if JavaScript compares:

```javascript
a.total = 63;
b.total = 85;
```

then:

```javascript
85 - 63 = 22
```

That positive result tells the sort logic that the bigger total should come first in this descending version.

One important detail is that `sort()` mutates the array it is called on. That means it changes the original array order.

If I want to sort without mutating the original, I should copy first:

```javascript
const sorted = [...items].sort((a, b) => a.total - b.total);
```

That is a very useful habit in frontend work.

---

#### Why `forEach` Was a Good Choice at the End

I liked that this exercise also reinforced the difference between transformation and side effects.

Earlier in the pipeline:

- `reduce` was used to build data
- `map` was used to reshape data
- `sort` was used to reorder data

At the very end:

```javascript
sortedTotals.forEach(({ category, total }) => {
  console.log(`${category}: $${total}`);
});
```

I used `forEach` because I was no longer creating a new transformed array. I was just doing something with each item: printing it.

That made `forEach` feel like the right final step.

---

#### What This Exercise Helped Me Practice

This tiny project gave me repetition with several useful patterns:

- grouping values into an object with `reduce`
- reading object entries with `Object.entries`
- reshaping data with `map`
- sorting numeric values with `sort`
- printing output with `forEach`
- handling missing values safely with `??`

That is a lot of useful JavaScript packed into one small exercise.

---

#### Common Beginner Mistakes to Watch For

A few things in this exercise are easy to get wrong at first.

#### 1. Trying to sort an object directly

Objects are not directly sortable the same way arrays are. That is why converting with `Object.entries()` is so useful.

#### 2. Forgetting the safe fallback with `?? 0`

Without that fallback, I might try to add a number onto `undefined`.

#### 3. Using `map` when I really mean `forEach`

If I am only printing or logging, `forEach` is usually a better signal of intent.

#### 4. Getting the sort direction backwards

This is a common one.

- ascending: `a - b`
- descending: `b - a`

#### 5. Writing everything in one giant unreadable chain

Breaking the logic into named variables makes it easier to read, debug, and explain.

---

#### Why This Matters in Angular

This is the kind of JavaScript that shows up constantly in Angular work.

A lot of frontend tasks look like this:

- receive an array from an API
- group or total the data
- sort it
- transform it into display-ready values
- render it in a template

That is why a small console drill like this is actually very relevant. It is a simple version of real UI data shaping.

---

#### Final Takeaway

My biggest takeaway from this refresher is that deep work days are where syntax starts becoming skill.

This exercise was not about learning flashy new features. It was about repeatedly applying a few important tools until they started making more intuitive sense.

The two biggest pieces I wanted to understand better were `reduce` and `sort`, and this drill helped a lot:

- `reduce` means combine many items into one result
- `sort` means compare two items and decide which should come first

The more clearly I can explain each step of a small exercise like this, the more confident I will be when I have to do the same kind of transformation in a real Angular application or an interview.
