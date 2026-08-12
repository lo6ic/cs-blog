---
title: "TypeScript Mastery: Checkpoint 1 and Communicating Intent"
description: "A practical teaching article on reviewing core TypeScript concepts, refactoring JavaScript into strict TypeScript, and using types to communicate intent to teammates."
published: true
datePublished: "August 11, 2026"
picture: "assets/posts/backshift.jpg"
tags:
  - typescript
  - refactoring
  - type-safety
---

### TypeScript Mastery: Checkpoint 1 and Communicating Intent

August 11, 2026

A TypeScript checkpoint is not only about asking, “Do these types compile?”

A better checkpoint question is:

> Can these types explain the intent of the code to another developer?

That is an important shift.

TypeScript is useful because it catches mistakes before runtime, but it also works as documentation for the rest of the team. A good type tells a teammate what a value should look like, what a function expects, what it returns, which states are valid, and which fields should not be changed.

This article walks through a practical checkpoint exercise: refactoring a small JavaScript order-summary drill into strict TypeScript with zero `any` usage.

The goal is to see how TypeScript communicates intent through:

- typed function parameters
- return types
- literal unions
- object models
- `readonly` fields
- discriminated unions
- typed sorting helpers
- strict array transformations

---

#### Start with the JavaScript Version

Here is the original JavaScript-style exercise:

```typescript
const orders = [
  { id: 1, customer: "Ava", status: "paid", total: 45 },
  { id: 2, customer: "Maya", status: "pending", total: 80 },
  { id: 3, customer: "Noah", status: "paid", total: 30 },
  { id: 4, customer: "Liam", status: "paid", total: 120 },
];

const paidOrderSummary = orders
  .filter((order) => order.status === "paid")
  .map((order) => ({
    id: order.id,
    customer: order.customer,
    total: order.total,
  }))
  .sort((a, b) => b.total - a.total);

const paidTotal = paidOrderSummary.reduce((sum, order) => sum + order.total, 0);
```

This code works.

It filters the paid orders, maps them into a smaller summary object, sorts them by total, and calculates the paid total.

But JavaScript alone does not clearly communicate all of the rules.

For example:

- What statuses are allowed?
- Should `id` be editable?
- What shape should an order have?
- What shape should a paid order summary have?
- What sort keys are valid?
- Should sorting mutate the original array?

These are the kinds of questions TypeScript can answer directly in the code.

---

#### Create a Controlled Vocabulary with Literal Unions

The first step is to define the allowed order statuses:

```typescript
type OrderStatus = "paid" | "pending" | "cancelled";
```

This is a literal union.

It says that an order status cannot be any random string. It must be one of these exact values.

That means this is valid:

```typescript
const status: OrderStatus = "paid";
```

But this is not:

```typescript
const status: OrderStatus = "complete";
```

A highlight I want to bring up is that sometimes people underestimate literal unions because they look simple.

But they prevent a real class of bugs.

If a developer accidentally types:

```typescript
status: "paidd";
```

or:

```typescript
status: "complete";
```

TypeScript can catch that before the application runs.

That is one of the easiest ways TypeScript communicates intent:

> These are the only valid words in this part of the domain.

---

#### Model the Main Order Entity

Next, define the shape of an order:

```typescript
type Order = {
  readonly id: number;
  customer: string;
  status: OrderStatus;
  total: number;
};
```

This type communicates several things.

The `id` must be a number.

The `customer` must be a string.

The `status` must be one of the valid `OrderStatus` values.

The `total` must be a number.

The `readonly` keyword communicates that the order identity should not be reassigned after creation.

```typescript
readonly id: number;
```

A highlight I want to bring up is that `readonly` is not about freezing the object at runtime. It is about communicating development-time intent.

It tells another developer:

> This field is part of the identity of the object. Do not casually rewrite it.

That matters in real applications because fields like IDs, creation dates, and system-generated references usually should not be treated like editable form fields.

---

#### Model the Smaller UI-Ready Shape

The full `Order` model has a `status`, but the paid order summary only needs:

- `id`
- `customer`
- `total`

So define a separate type:

```typescript
type PaidOrderSummary = {
  readonly id: number;
  customer: string;
  total: number;
};
```

This is a useful frontend pattern.

Raw application data and UI-ready data are not always the same shape.

A full order might include status, timestamps, line items, or backend-only fields. A summary card or table row may only need a smaller object.

A separate `PaidOrderSummary` type communicates that difference clearly.

---

#### Type the Data

Now the order list can be typed:

```typescript
const orders: Order[] = [
  { id: 1, customer: "Ava", status: "paid", total: 45 },
  { id: 2, customer: "Maya", status: "pending", total: 80 },
  { id: 3, customer: "Noah", status: "paid", total: 30 },
  { id: 4, customer: "Liam", status: "paid", total: 120 },
];
```

This tells TypeScript:

> Every item in this array should be an `Order`.

Now if one object is missing `total`, has an invalid `status`, or uses the wrong type for `id`, the editor can catch it.

This is where TypeScript starts feeling less like “extra syntax” and more like guardrails.

---

#### Refactor the Transformation into a Typed Function

Instead of keeping the chain loose, move it into a typed function:

```typescript
function getPaidOrderSummary(orders: readonly Order[]): PaidOrderSummary[] {
  return orders
    .filter((order) => order.status === "paid")
    .map((order) => ({
      id: order.id,
      customer: order.customer,
      total: order.total,
    }))
    .sort((a, b) => b.total - a.total);
}
```

This signature communicates intent:

```typescript
orders: readonly Order[]
```

means:

> This function reads from an order list, but it should not mutate the original input.

And this return type:

```typescript
PaidOrderSummary[]
```

means:

> This function returns an array of paid order summary objects.

That is useful for teammates.

They do not need to inspect every line inside the function to understand its contract. The function signature already tells them the basic story.

---

#### Write a Typed Reducer

The total calculation can also become a typed function:

```typescript
function getOrderTotal(orders: readonly PaidOrderSummary[]): number {
  return orders.reduce((sum, order) => sum + order.total, 0);
}
```

This communicates:

> Give this function paid order summaries, and it returns one number.

This is a good example of TypeScript making a familiar JavaScript pattern easier to reason about.

The reducer still works the same way:

```typescript
(sum, order) => sum + order.total;
```

But the surrounding type tells the reader what kind of data the reducer expects and what kind of value it produces.

---

#### Add Sort Options with Literal Unions

Sorting is another place where TypeScript helps.

Start with the allowed sort keys:

```typescript
type OrderSortKey = "customer" | "total";
```

Then define sort direction:

```typescript
type SortDirection = "asc" | "desc";
```

Now a function can prevent invalid sort options:

```typescript
function sortPaidOrders(orders: readonly PaidOrderSummary[], sortKey: OrderSortKey, direction: SortDirection = "asc"): PaidOrderSummary[] {
  return [...orders].sort((a, b) => {
    let comparison = 0;

    if (sortKey === "customer") {
      comparison = a.customer.localeCompare(b.customer);
    }

    if (sortKey === "total") {
      comparison = a.total - b.total;
    }

    return direction === "asc" ? comparison : -comparison;
  });
}
```

This prevents calls like:

```typescript
sortPaidOrders(paidOrderSummary, "status", "up");
```

Why?

Because `"status"` is not an `OrderSortKey`, and `"up"` is not a `SortDirection`.

That is TypeScript reducing invalid usage before runtime.

---

#### Why Use `localeCompare` for Strings?

A question that often comes up during sorting is:

> What is `localeCompare`, and why use it?

For numbers, sorting usually uses subtraction:

```typescript
a.total - b.total;
```

That works because both values are numbers.

But strings cannot be subtracted meaningfully.

This does not work:

```typescript
a.customer - b.customer;
```

For strings, use `localeCompare`:

```typescript
a.customer.localeCompare(b.customer);
```

`localeCompare` compares one string to another and returns a number that works with `.sort()`.

The return value means:

```text
negative number = the first string should come before the second
0 = the strings are considered equal
positive number = the first string should come after the second
```

So this:

```typescript
"Ava".localeCompare("Liam");
```

returns a negative number because `"Ava"` comes before `"Liam"` alphabetically.

This:

```typescript
"Liam".localeCompare("Ava");
```

returns a positive number because `"Liam"` comes after `"Ava"`.

And this:

```typescript
"Ava".localeCompare("Ava");
```

returns `0`.

A highlight I want to bring up is that `.sort()` does not care whether the comparison came from subtracting numbers or comparing strings. It only needs a number that tells it how to order two items.

For numbers:

```typescript
a.total - b.total;
```

For strings:

```typescript
a.customer.localeCompare(b.customer);
```

Both produce the comparison value `.sort()` needs.

---

#### Avoid Mutating the Original Array

Inside the sort helper, this part matters:

```typescript
return [...orders].sort((a, b) => {
  // comparison logic
});
```

The spread syntax creates a copy before sorting.

That is important because JavaScript’s `.sort()` mutates the array it is called on.

A highlight I want to bring up is that sometimes people forget `.sort()` changes the original array. In frontend applications, accidental mutation can create confusing UI bugs.

Using:

```typescript
[...orders].sort(...)
```

is a safer habit because the helper returns a sorted copy while leaving the original input alone.

---

#### Add a Checkpoint State with a Discriminated Union

A checkpoint can also be modeled with a discriminated union:

```typescript
type CheckpointState<T> = { status: "not-started" } | { status: "in-progress" } | { status: "complete"; data: T } | { status: "needs-review"; weakSpots: string[] };
```

This type communicates that the checkpoint can only be in one of four valid states.

It also connects each state to the data that belongs with it.

If the status is `"complete"`, the object needs `data`.

```typescript
const checkpointState: CheckpointState<PaidOrderSummary[]> = {
  status: "complete",
  data: paidOrderSummary,
};
```

If the status is `"needs-review"`, the object needs `weakSpots`.

```typescript
const checkpointState2: CheckpointState<PaidOrderSummary[]> = {
  status: "needs-review",
  weakSpots: ["reduce", "generics"],
};
```

This is stronger than a loose state object with optional properties.

A loose version might allow confusing combinations like:

```typescript
{
  status: "complete",
  weakSpots: ["generics"]
}
```

or:

```typescript
{
  status: "needs-review",
  data: paidOrderSummary
}
```

The discriminated union prevents those mismatches.

---

#### Render the Checkpoint State

Now the render function can safely branch on `state.status`:

```typescript
function renderCheckpointState(state: CheckpointState<PaidOrderSummary[]>): string {
  switch (state.status) {
    case "not-started":
      return "Not started yet.";

    case "in-progress":
      return "In progress...";

    case "complete":
      return `Completed ${state.data.length} orders.`;

    case "needs-review":
      return `Needs review: ${state.weakSpots}.`;
  }
}
```

Inside this branch:

```typescript
case "complete":
```

TypeScript knows `state.data` exists.

Inside this branch:

```typescript
case "needs-review":
```

TypeScript knows `state.weakSpots` exists.

That is discriminated union narrowing.

The shared `status` field tells TypeScript which object shape is active.

---

#### Literal Unions vs Discriminated Unions

A helpful distinction is this:

> A literal union controls exact allowed values. A discriminated union controls object shapes using exact allowed values.

A literal union looks like this:

```typescript
type OrderStatus = "paid" | "pending" | "cancelled";
```

It says:

> This value must be one of these exact strings.

A discriminated union looks like this:

```typescript
type CheckpointState<T> = { status: "not-started" } | { status: "in-progress" } | { status: "complete"; data: T } | { status: "needs-review"; weakSpots: string[] };
```

It says:

> This object must be one of these exact shapes, and the `status` field tells us which shape it is.

A highlight I want to bring up is that discriminated unions are built on literal values. The literal value identifies the branch.

So when `status` is `"complete"`, TypeScript knows the object has `data`.

When `status` is `"needs-review"`, TypeScript knows the object has `weakSpots`.

That is why discriminated unions are so useful for frontend state.

---

#### What Feels Usable at This Checkpoint?

By this checkpoint, these TypeScript features should start feeling very usable:

- typed function parameters and return values
- literal unions for statuses and sort directions
- `readonly` fields for identity-like values
- basic object modeling
- discriminated union state

These are the foundation pieces.

They show up constantly in Angular codebases.

For example, Angular components often receive typed inputs, services return typed data, and templates depend on clear loading, success, and error states.

---

#### What May Still Feel Abstract?

Some TypeScript features naturally take more repetition.

Generics with multiple type parameters may still feel abstract:

```typescript
function mapApiResponse<T, U>(response: ApiResponse<T>, mapper: (data: T) => U): ApiResponse<U> {
  // ...
}
```

A helpful phrase is:

> `T` is what the function has. `U` is what it turns it into.

`keyof` and pluck-style helpers may also need more practice:

```typescript
function pluck<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}
```

Read it as:

> `K` must be a real key of `T`, and the return type is the value type at that key.

Strict `null` and `undefined` handling may also feel a little hazy at first.

A useful starting point is:

```text
undefined = no value was produced or found
null = intentionally empty
```

That is not the only way to think about it, but it is a practical mental model.

A highlight I want to bring up is that these abstract-feeling topics usually become clearer through small repeated drills, not one big reading session.

---

#### How TypeScript Communicates Intent to Teammates

TypeScript helps teammates understand code faster because the contracts are visible.

This function:

```typescript
function getOrderTotal(orders: readonly PaidOrderSummary[]): number;
```

communicates:

> This function reads paid order summaries and returns a number.

This type:

```typescript
type SortDirection = "asc" | "desc";
```

communicates:

> These are the only valid sort directions.

This type:

```typescript
type CheckpointState<T> = { status: "not-started" } | { status: "in-progress" } | { status: "complete"; data: T } | { status: "needs-review"; weakSpots: string[] };
```

communicates:

> These are the only valid checkpoint states, and each state has its own required data.

A strong interview explanation would sound like this:

> TypeScript helps communicate intent to teammates by making expectations visible in the code. Object types show the shape of data, function signatures show what inputs are required and what outputs are returned, and literal unions show the allowed values for things like statuses or sort keys. `readonly` communicates that certain fields, like IDs or creation dates, should not be reassigned. Discriminated unions make UI state clearer by showing which states are valid and what data belongs to each state. This reduces guessing during development and makes refactoring safer because teammates can see the contracts the code is supposed to follow.

---

#### Final TypeScript Version

Here is the full checkpoint example:

```typescript
type OrderStatus = "paid" | "pending" | "cancelled";

type Order = {
  readonly id: number;
  customer: string;
  status: OrderStatus;
  total: number;
};

type PaidOrderSummary = {
  readonly id: number;
  customer: string;
  total: number;
};

const orders: Order[] = [
  { id: 1, customer: "Ava", status: "paid", total: 45 },
  { id: 2, customer: "Maya", status: "pending", total: 80 },
  { id: 3, customer: "Noah", status: "paid", total: 30 },
  { id: 4, customer: "Liam", status: "paid", total: 120 },
];

function getPaidOrderSummary(orders: readonly Order[]): PaidOrderSummary[] {
  return orders
    .filter((order) => order.status === "paid")
    .map((order) => ({
      id: order.id,
      customer: order.customer,
      total: order.total,
    }))
    .sort((a, b) => b.total - a.total);
}

function getOrderTotal(orders: readonly PaidOrderSummary[]): number {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

type OrderSortKey = "customer" | "total";
type SortDirection = "asc" | "desc";

function sortPaidOrders(orders: readonly PaidOrderSummary[], sortKey: OrderSortKey, direction: SortDirection = "asc"): PaidOrderSummary[] {
  return [...orders].sort((a, b) => {
    let comparison = 0;

    if (sortKey === "customer") {
      comparison = a.customer.localeCompare(b.customer);
    }

    if (sortKey === "total") {
      comparison = a.total - b.total;
    }

    return direction === "asc" ? comparison : -comparison;
  });
}

type CheckpointState<T> = { status: "not-started" } | { status: "in-progress" } | { status: "complete"; data: T } | { status: "needs-review"; weakSpots: string[] };

function renderCheckpointState(state: CheckpointState<PaidOrderSummary[]>): string {
  switch (state.status) {
    case "not-started":
      return "Not started yet.";

    case "in-progress":
      return "In progress...";

    case "complete":
      return `Completed ${state.data.length} orders.`;

    case "needs-review":
      return `Needs review: ${state.weakSpots.join(", ")}.`;
  }
}

const paidOrderSummary = getPaidOrderSummary(orders);
const paidTotal = getOrderTotal(paidOrderSummary);

const sortedByCustomer = sortPaidOrders(paidOrderSummary, "customer", "asc");

const checkpointState: CheckpointState<PaidOrderSummary[]> = {
  status: "complete",
  data: paidOrderSummary,
};

console.log(paidOrderSummary);
console.log(paidTotal);
console.log(sortedByCustomer);
console.log(renderCheckpointState(checkpointState));
```

---

#### Why This Matters in Angular

Angular applications rely heavily on clear contracts.

A component needs to know what shape its input data has.

A service needs to know what an HTTP call returns.

A template needs to know which fields are safe to display.

A state model needs to prevent confusing combinations like loading with data and an error at the same time.

The TypeScript patterns in this checkpoint map directly to Angular work:

- `Order` is like an API model
- `PaidOrderSummary` is like a view model
- `OrderStatus` is like a controlled status field
- `sortPaidOrders` is like a utility function used by a component
- `CheckpointState<T>` is like frontend UI state
- `readonly` communicates fields that should not be changed

That is why TypeScript is more than syntax. It is a communication tool.

---

#### Final Takeaway

The main takeaway from this checkpoint is that TypeScript helps turn assumptions into visible contracts.

Instead of hoping a status is spelled correctly, the type system limits the valid options.

Instead of hoping a function receives the right data, the function signature explains what it expects.

Instead of guessing what state a UI is in, a discriminated union describes each valid branch.

And instead of relying only on runtime testing to catch simple mistakes, TypeScript can catch many of them while the code is still being written.

That is how TypeScript helps teammates move faster with less guessing.
