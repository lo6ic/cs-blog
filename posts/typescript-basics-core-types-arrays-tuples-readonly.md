---
title: "TypeScript Basics: Core Types, Arrays, Tuples, and Readonly"
description: "A practical TypeScript teaching article focused on core types, arrays, tuple tradeoffs, readonly properties, readonly arrays, and what compile-time protection does and does not guarantee."
published: true
datePublished: "July 17, 2026"
picture: "assets/posts/cords.jpg"
---

### TypeScript Basics: Core Types, Arrays, Tuples, and Readonly

July 17, 2026

One of the most useful TypeScript skills is learning how to model data clearly.

A good TypeScript type does more than describe what a value looks like. It also communicates how that value should be used.

Some data should be editable. Some data should be protected from accidental reassignment. Some values are simple arrays. Some values might look compact as tuples, but become harder to understand once the code grows.

This lesson focuses on a practical question:

> Which parts of a model should be allowed to change, and which parts should be protected?

That question matters a lot in Angular applications because components and services often work with data that comes from APIs, forms, route state, or user actions.

A transaction is a good example to learn from.

Some transaction fields, like a note or status, may be editable. Other fields, like an `id`, creation date, or source, usually should not change after the transaction is created.

That is where `readonly` becomes useful.

---

#### Core Types in TypeScript

TypeScript starts with the same basic kinds of values JavaScript already uses:

```typescript
let transactionId: number = 101;
let merchant: string = "Best Buy";
let amount: number = 29.99;
let isCleared: boolean = false;
```

These annotations tell TypeScript what kind of value each variable should hold.

In many cases, TypeScript can infer the type without needing an explicit annotation:

```typescript
let merchant = "Best Buy"; // string
let amount = 29.99; // number
let isCleared = false; // boolean
```

A highlight I want to bring up is that TypeScript is not about writing as many annotations as possible. It is about making the important contracts clear.

If TypeScript can easily infer a type, the annotation may not be needed. But when modeling objects, function inputs, function outputs, or API data, explicit types can make the code much easier to understand.

---

#### Modeling a Transaction

Here is a transaction model to learn from:

```typescript
type TransactionStatus = "pending" | "cleared" | "failed";

type Transaction = {
  readonly id: number;
  readonly createdAt: string;
  readonly source: "bank" | "manual" | "imported";
  merchant: string;
  amount: number;
  status: TransactionStatus;
  category?: string;
  notes?: string;
};
```

This type says a transaction has:

1. an `id`
2. a creation date
3. a source
4. a merchant
5. an amount
6. a status
7. optional category and notes fields

The interesting part is that some fields are marked `readonly`.

```typescript
readonly id: number;
readonly createdAt: string;
readonly source: "bank" | "manual" | "imported";
```

These fields describe transaction identity and origin. Once a transaction exists, these should not usually be reassigned.

The remaining fields are mutable:

```typescript
merchant: string;
amount: number;
status: TransactionStatus;
category?: string;
notes?: string;
```

Those fields may need to change as the application updates the transaction, categorizes it, clears it, or adds user notes.

That is the main design decision:

```text
readonly fields protect identity-like data.
mutable fields allow intentional edits.
```

---

#### Creating a Transaction List

Here is an example transaction list:

```typescript
const transactions: Transaction[] = [
  {
    id: 1,
    createdAt: "2026-01-01",
    source: "bank",
    merchant: "Best Buy",
    amount: 29.99,
    status: "pending",
  },
  {
    id: 2,
    createdAt: "2026-01-02",
    source: "manual",
    merchant: "Fishing Is Us",
    amount: 9.99,
    status: "pending",
    category: "fishing",
    notes: "how to fish",
  },
  {
    id: 3,
    createdAt: "2026-02-02",
    source: "imported",
    merchant: "Carmax",
    amount: 29999.99,
    status: "cleared",
    category: "car",
    notes: "BMW",
  },
];
```

Because the array is typed as `Transaction[]`, TypeScript checks that every object in the array matches the transaction shape.

That means every transaction needs the required fields:

```text
id
createdAt
source
merchant
amount
status
```

But the optional fields can be omitted:

```typescript
category?: string;
notes?: string;
```

The question mark means those properties may exist, but they are not required.

---

#### Updating Mutable Fields

Since `category`, `status`, and `notes` are mutable, these updates are allowed:

```typescript
transactions[0].category = "Education";
transactions[1].status = "cleared";
transactions[2].notes = "Reviewed manually";
```

That is intentional.

The type is saying these fields can change as the app works with the transaction.

For example, a transaction might start as pending:

```typescript
status: "pending";
```

Then later move to:

```typescript
status: "cleared";
```

That is a normal business change, so `status` should stay mutable.

---

#### Protecting Readonly Fields

These updates should be blocked by TypeScript:

```typescript
transactions[0].id = 999;
transactions[1].createdAt = "2026-03-09";
transactions[2].source = "manual";
```

The reason is that those properties were marked `readonly`.

```typescript
readonly id: number;
readonly createdAt: string;
readonly source: "bank" | "manual" | "imported";
```

A highlight I want to bring up is that `readonly` does not mean “this value can never change anywhere in the universe.”

It means TypeScript should prevent reassignment through normal typed code during development.

That distinction matters because TypeScript types are erased when the code becomes JavaScript.

---

#### Readonly Is Compile-Time Safety

One of the most important things to understand about `readonly` is that it is a TypeScript safety tool.

It helps during development and type-checking.

It does not freeze the object at runtime.

This means TypeScript can warn about code like this:

```typescript
transactions[0].id = 999;
```

But after TypeScript compiles to JavaScript, the object is still a normal JavaScript object unless a runtime tool like `Object.freeze()` is used.

That gives us a useful mental model:

```text
readonly protects typed code during development.
Object.freeze protects runtime objects.
```

Those are not the same thing.

Sometimes people miss this idea and treat `readonly` like a runtime security feature. It is not. It is a compile-time guardrail.

---

#### Readonly Arrays

A transaction list can also be exposed through a readonly array reference:

```typescript
const lockedTransactions: readonly Transaction[] = transactions;
```

This means array-level mutation methods are blocked through that reference.

These should not be allowed:

```typescript
lockedTransactions.push(transactions[0]);
lockedTransactions.pop();
lockedTransactions.sort();
```

That is useful when a function or part of the app should only read from the list, not change the list.

However, this is the subtle part:

```typescript
lockedTransactions[0].status = "failed";
```

This can still be allowed.

Why?

Because `readonly Transaction[]` protects the array reference. It prevents changing the array structure with methods like `push`, `pop`, `splice`, and `sort`.

It does not automatically make every property of every transaction readonly.

The array is readonly, but the transaction objects inside the array still follow the `Transaction` type. Since `status` is mutable in `Transaction`, the status can still be changed.

A highlight I want to bring up is that sometimes people expect `readonly Transaction[]` to make the entire nested object graph immutable. It does not. It only protects the array reference.

---

#### Readonly Properties vs Readonly Arrays

These two ideas are related, but they protect different things.

A readonly property protects a property from reassignment:

```typescript
type Transaction = {
  readonly id: number;
  status: "pending" | "cleared" | "failed";
};
```

This should be blocked:

```typescript
transaction.id = 2;
```

A readonly array protects the array reference from array-level mutations:

```typescript
const transactions: readonly Transaction[] = [{ id: 1, status: "pending" }];
```

This should be blocked:

```typescript
transactions.push({ id: 2, status: "cleared" });
```

But this may still be allowed:

```typescript
transactions[0].status = "cleared";
```

Why? Because `status` itself is not readonly.

This is the key distinction:

```text
readonly property = protects that property
readonly array = protects the array structure
```

---

#### Tuple Tradeoffs

TypeScript also supports tuples.

A tuple is an array with a fixed structure:

```typescript
type TransactionTuple = readonly [number, string, number];

const tupleTransaction: TransactionTuple = [1, "Coffee Shop", 6.75];
```

This tuple means:

```text
position 0 is a number
position 1 is a string
position 2 is a number
```

The tuple is shorter than an object, but it is less readable.

Compare this:

```typescript
const tupleTransaction: TransactionTuple = [1, "Coffee Shop", 6.75];
```

with this:

```typescript
const transaction = {
  id: 1,
  merchant: "Coffee Shop",
  amount: 6.75,
};
```

The object is easier to understand because the field names explain what the values mean.

A tuple can be useful when positions are naturally meaningful, like coordinates:

```typescript
type Coordinates = readonly [number, number];

const location: Coordinates = [41.88, -87.63];
```

But for business data like transactions, objects are usually clearer.

Sometimes people reach for tuples because they are compact. The tradeoff is that compact code is not always readable code.

---

#### Readonly Function Parameters

Readonly arrays are especially useful for function parameters.

If a function only needs to read a transaction list, the parameter can be marked readonly:

```typescript
function printTransactionSummary(transactions: readonly Transaction[]): void {
  if (transactions.length === 0) {
    console.log("No transactions");
    return;
  }

  for (const transaction of transactions) {
    console.log(`${transaction.merchant} - $${transaction.amount} - ${transaction.status}`);
  }
}
```

This function is saying:

```text
Give me a list of transactions.
I will read from the list.
I will not change the list structure.
```

Inside the function, this should be blocked:

```typescript
transactions.push(transactions[0]);
```

That is a good use of TypeScript as documentation.

The function signature communicates intent before anyone reads the function body.

---

#### A Note About `for...in` and `for...of`

When looping over an array of transactions, it is common to want each transaction object.

For that, use `for...of`:

```typescript
for (const transaction of transactions) {
  console.log(transaction.merchant);
}
```

Here, `transaction` is the actual item from the array.

Sometimes people use `for...in` when they mean `for...of`:

```typescript
for (const transaction in transactions) {
  console.log(transaction.merchant);
}
```

That does not work the same way.

With arrays, `for...in` gives the indexes:

```text
"0"
"1"
"2"
```

So the loop variable is not a transaction object. It is the index/key.

The mental model is:

```text
for...in = keys or indexes
for...of = values or items
```

For an array of objects, `for...of` is usually the better fit.

---

#### Common Things to Pay Attention To

#### 1. Sometimes people mark too many fields readonly

Not every field should be readonly.

If a field is meant to change because of user actions or application state, it should probably stay mutable.

Good readonly candidates are:

- `id`
- `createdAt`
- `source`
- system-generated references
- audit fields

Good mutable candidates are:

- `status`
- `category`
- `notes`
- editable labels
- selected state

The goal is not to make everything readonly. The goal is to model the data honestly.

---

#### 2. Sometimes people expect readonly to freeze runtime objects

`readonly` is a TypeScript type-checking feature.

It does not freeze the object at runtime.

If runtime immutability is needed, that is a separate JavaScript concern.

This distinction is important in interviews because it shows an understanding of the difference between TypeScript’s development-time checks and JavaScript’s runtime behavior.

---

#### 3. Sometimes people expect readonly arrays to be deeply readonly

This is one of the biggest misunderstandings.

```typescript
const lockedTransactions: readonly Transaction[] = transactions;
```

This protects the array reference from array-level mutations.

It does not automatically make each transaction deeply immutable.

So if the `Transaction` type has a mutable `status`, that `status` can still be updated.

---

#### 4. A highlight I want to bring up is that types should describe intent

A type should tell the next developer how the data is supposed to behave.

When a property is marked readonly, that communicates:

```text
This value is not supposed to be reassigned after creation.
```

When a function accepts a readonly array, that communicates:

```text
This function only reads the list.
```

That is one of the biggest benefits of TypeScript. It makes intent visible.

---

#### Why This Matters in Angular

This lesson connects directly to Angular development.

Angular applications often deal with models like:

- users
- transactions
- tasks
- orders
- form data
- API responses
- view models

Some of those fields should be protected. Others should be editable.

For example, an Angular service might fetch transactions from an API and expose them to a component. The component may need to display the list and update a transaction status, but it should probably not reassign system-generated IDs or creation dates.

Readonly types help make those boundaries clearer.

This also matters for function and service design.

A function like this:

```typescript
function printTransactionSummary(transactions: readonly Transaction[]): void;
```

communicates that it only reads the list.

That kind of clarity becomes more valuable as Angular applications grow.

---

#### Interview-Ready Explanation

A strong explanation sounds like this:

> `readonly` protects you from accidental reassignment during TypeScript type-checking, so it is a development-time safety feature rather than a runtime guarantee. It is useful for fields that should not change after creation, such as an `id`, `createdAt` date, or `source`. When applied to an array reference, such as `readonly Transaction[]`, it prevents array-level mutations like `push`, `pop`, and `sort` through that reference. However, `readonly` does not freeze objects at runtime because the TypeScript types disappear when the code compiles to JavaScript. It also does not automatically make nested objects or mutable properties deeply readonly unless those specific properties are also typed that way.

That answer is strong because it covers both sides:

1. what `readonly` does protect
2. what `readonly` does not protect

---

#### Final Takeaway

The biggest takeaway from this lesson is that `readonly` is about communicating and enforcing intent during development.

It protects against accidental reassignment in TypeScript, but it does not freeze JavaScript objects at runtime.

It is useful for fields that represent identity, origin, or audit information. It is also useful for function parameters when a function should only read from an array.

The important distinction is this:

```text
readonly property protects a property.
readonly array protects the array structure.
neither one automatically guarantees deep runtime immutability.
```

Understanding that distinction helps make TypeScript code clearer, safer, and easier to explain in Angular interviews.
