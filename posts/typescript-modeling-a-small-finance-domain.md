---
title: "TypeScript Mastery: Modeling a Small Finance Domain"
description: "A practical teaching article on using TypeScript to model a realistic finance tracker domain with entities, literal unions, request states, filters, sorting helpers, readonly fields, and compile-time bug prevention."
published: true
datePublished: "August 1, 2026"
picture: "assets/posts/arrow.jpg"
tags:
  - typescript
  - domain-modeling
  - request-state
---

### TypeScript Mastery: Modeling a Small Finance Domain

August 1, 2026

A deep work TypeScript session is different from reading isolated snippets.

Instead of studying one syntax feature by itself, the goal is to model something that feels closer to a real frontend application.

A finance tracker is a good example because it has a clear domain:

- transactions
- statuses
- categories
- request states
- filters
- sorting options
- render branches

This kind of exercise helps turn TypeScript from “syntax I can recognize” into “a tool I can use to prevent mistakes.”

The main idea is:

> TypeScript reduces bugs before runtime by making invalid values and invalid states harder to represent.

That is especially important in Angular applications, where components, services, API calls, and templates all depend on clear data shapes.

---

#### Start with the Domain Vocabulary

A good TypeScript model usually starts by naming the allowed values in the domain.

For a finance tracker, a transaction can have a status:

```typescript
type TransactionStatus = "pending" | "cleared" | "failed";
```

It can have a type:

```typescript
type TransactionType = "income" | "expense";
```

And it can belong to a category:

```typescript
type TransactionCategory = "education" | "groceries" | "transportation" | "housing" | "entertainment" | "income" | "uncategorized";
```

These are literal unions.

They are useful because they create a controlled vocabulary.

Instead of writing:

```typescript
status: string;
```

the code says:

```typescript
status: TransactionStatus;
```

That means TypeScript will allow:

```typescript
status: "pending";
status: "cleared";
status: "failed";
```

But it will reject:

```typescript
status: "complete";
status: "loadnig";
status: "done";
```

A highlight I want to bring up is that literal unions are not just extra typing. They are one of the easiest ways to catch real mistakes early.

For example, if someone accidentally types `"loadnig"` instead of `"loading"` in a request state, TypeScript can catch that before the application runs. Without the union type, that typo may not fail until the UI silently renders the wrong branch.

---

#### Model the Main Entity

Once the domain vocabulary exists, the next step is to model the main entity.

In this example, the main entity is a transaction.

```typescript
type Transaction = {
  readonly id: number;
  readonly createdAt: string;
  merchant: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: TransactionCategory;
  notes?: string;
};
```

This type describes the shape of a transaction.

Some fields are marked `readonly`:

```typescript
readonly id: number;
readonly createdAt: string;
```

Those fields represent identity or audit information. Once a transaction exists, the application usually should not accidentally reassign its ID or creation date.

Other fields are intentionally left mutable:

```typescript
merchant: string;
amount: number;
type: TransactionType;
status: TransactionStatus;
category: TransactionCategory;
notes?: string;
```

Those fields may need to change as the transaction is edited, categorized, corrected, or reviewed.

A highlight I want to bring up is that sometimes people make every property mutable by default. That works, but it misses an opportunity for TypeScript to protect important fields from accidental reassignment.

The type should communicate intent:

> Some values are part of the transaction’s identity.  
> Some values are business fields that may change.

---

#### Create Valid Sample Transactions

With the `Transaction` type in place, sample data can be created safely.

```typescript
const trans1: Transaction = {
  id: 1,
  createdAt: "2026-01-01",
  merchant: "WalMart",
  amount: 12.99,
  type: "expense",
  status: "cleared",
  category: "entertainment",
  notes: "fun stuff",
};

const trans2: Transaction = {
  id: 2,
  createdAt: "2026-01-11",
  merchant: "Landlord",
  amount: 550.0,
  type: "expense",
  status: "pending",
  category: "housing",
  notes: "rent",
};

const trans3: Transaction = {
  id: 3,
  createdAt: "2026-01-21",
  merchant: "HyVee",
  amount: 12.99,
  type: "expense",
  status: "cleared",
  category: "groceries",
};

const trans4: Transaction = {
  id: 4,
  createdAt: "2026-01-30",
  merchant: "CarMax",
  amount: 15.99,
  type: "income",
  status: "failed",
  category: "transportation",
  notes: "refund",
};
```

Then the list can be collected into an array:

```typescript
const theTransactions = [trans1, trans2, trans3, trans4];
```

TypeScript can infer this as an array of transactions because each item matches the `Transaction` shape.

A highlight I want to bring up is that TypeScript checks the structure and the allowed values, but it does not automatically understand every business rule.

For example, this may be valid TypeScript:

```typescript
type: "income";
category: "transportation";
```

Both values are allowed individually.

But if the finance app has a business rule that income transactions should only use the `"income"` category, that rule would need to be modeled separately.

TypeScript protects the rules that are expressed in the type system. It cannot protect rules that were never modeled.

---

#### Add a Request State

Frontend applications rarely just “have data.”

Usually, they are in one of several states:

- no request has started yet
- a request is loading
- a request succeeded
- there is no data
- something failed

That can be modeled with a generic discriminated union:

```typescript
type RequestState<T> = { status: "idle" } | { status: "loading" } | { status: "success"; data: T } | { status: "empty" } | { status: "error"; message: string };
```

This says:

> A request state has a `status`.  
> If the status is `"success"`, it must have `data`.  
> If the status is `"error"`, it must have a `message`.

For a transaction list, the type becomes:

```typescript
RequestState<Transaction[]>;
```

That means the success branch contains an array of transactions.

```typescript
const transactionSuccess: RequestState<Transaction[]> = {
  status: "success",
  data: theTransactions,
};

const transactionError: RequestState<Transaction[]> = {
  status: "error",
  message: "No transactions",
};

const transactionEmpty: RequestState<Transaction[]> = {
  status: "empty",
};
```

This is safer than using a loose state object like this:

```typescript
type LooseState<T> = {
  loading?: boolean;
  data?: T;
  error?: string;
};
```

A loose state object can accidentally represent confusing combinations:

```typescript
{
  loading: true,
  data: theTransactions,
  error: "Failed"
}
```

That state says the request is loading, has data, and has an error all at the same time.

A discriminated union makes each state explicit.

---

#### Model Filters with Optional Properties

A finance tracker usually needs filtering.

For example:

- show only cleared transactions
- show only expenses
- show only groceries
- show transactions above a certain amount
- show transactions below a certain amount

That filter shape can be modeled like this:

```typescript
type TransactionFilter = {
  status?: TransactionStatus;
  type?: TransactionType;
  category?: TransactionCategory;
  minAmount?: number;
  maxAmount?: number;
};
```

The properties are optional because a caller may only want to filter by one or two fields.

For example:

```typescript
const clearedExpenses = filterTransactions(theTransactions, {
  status: "cleared",
  type: "expense",
});
```

or:

```typescript
const educationTransactions = filterTransactions(theTransactions, {
  category: "education",
});
```

This is useful because TypeScript still protects the allowed values.

This should fail:

```typescript
const badFilter: TransactionFilter = {
  status: "complete",
};
```

Why?

Because `"complete"` is not a valid `TransactionStatus`.

---

#### Write a Filter Function

The filter function can be written with a readonly input array:

```typescript
function filterTransactions(transactions: readonly Transaction[], filter: TransactionFilter): Transaction[] {
  return transactions.filter((transaction) => {
    if (filter.status && transaction.status !== filter.status) return false;
    if (filter.type && transaction.type !== filter.type) return false;
    if (filter.category && transaction.category !== filter.category) return false;

    if (filter.minAmount !== undefined && transaction.amount < filter.minAmount) {
      return false;
    }

    if (filter.maxAmount !== undefined && transaction.amount > filter.maxAmount) {
      return false;
    }

    return true;
  });
}
```

The parameter:

```typescript
transactions: readonly Transaction[];
```

communicates that the helper should read from the transaction list, not mutate it.

The return type:

```typescript
Transaction[];
```

communicates that the function returns a new filtered array.

A highlight I want to bring up is the numeric check:

```typescript
filter.minAmount !== undefined;
```

This is better than:

```typescript
if (filter.minAmount) {
  // ...
}
```

Why?

Because `0` is a valid number but is falsy in JavaScript.

Sometimes people use truthy checks for numeric filters and accidentally skip valid values like `0`. Checking against `undefined` is more precise.

---

#### Model Sort Options

Sorting is another place where TypeScript can prevent mistakes.

Instead of letting the caller pass any string, define the allowed sort keys:

```typescript
type TransactionSortKey = "createdAt" | "amount" | "merchant";
```

Then define the allowed directions:

```typescript
type SortDirection = "asc" | "desc";
```

Now this is valid:

```typescript
sortTransactions(theTransactions, "amount", "desc");
```

But this should fail:

```typescript
sortTransactions(theTransactions, "name", "down");
```

Why?

Because `"name"` is not a valid `TransactionSortKey`, and `"down"` is not a valid `SortDirection`.

This is a strong example of TypeScript reducing bugs before runtime.

---

#### Write a Sort Function Without Mutating the Original Array

The sort function should avoid mutating the original transaction list.

JavaScript’s `.sort()` mutates the array it is called on, so the safer habit is to copy first:

```typescript
function sortTransactions(transactions: readonly Transaction[], sortKey: TransactionSortKey, direction: SortDirection = "asc"): Transaction[] {
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    if (sortKey === "amount") {
      comparison = a.amount - b.amount;
    }

    if (sortKey === "createdAt") {
      comparison = a.createdAt.localeCompare(b.createdAt);
    }

    if (sortKey === "merchant") {
      comparison = a.merchant.localeCompare(b.merchant);
    }

    return direction === "asc" ? comparison : -comparison;
  });
}
```

There are two important details here.

First, this creates a copy:

```typescript
[...transactions];
```

That prevents the original array from being reordered.

Second, the direction has a default value:

```typescript
direction: SortDirection = "asc";
```

A highlight I want to bring up is that sometimes people type the parameter as optional:

```typescript
direction?: SortDirection;
```

and then write:

```typescript
return direction === "asc" ? comparison : -comparison;
```

That creates a subtle bug.

If `direction` is `undefined`, the expression behaves like descending because `undefined === "asc"` is false.

Giving the parameter a default value makes the behavior match the function contract.

---

#### Render the Request State

The render function uses the `status` field to narrow the request state.

```typescript
function renderTransactionState(state: RequestState<Transaction[]>): string {
  switch (state.status) {
    case "idle":
      return "No transactions requested yet.";

    case "loading":
      return "Loading transactions...";

    case "success":
      return `Loaded ${state.data.length} transactions.`;

    case "empty":
      return "No transactions found.";

    case "error":
      return `Error: ${state.message}`;
  }
}
```

Inside the success branch, TypeScript knows this exists:

```typescript
state.data;
```

Inside the error branch, TypeScript knows this exists:

```typescript
state.message;
```

That works because `RequestState<T>` is a discriminated union.

The shared field is:

```typescript
status;
```

The literal values are:

```typescript
"idle";
"loading";
"success";
"empty";
"error";
```

This is the same pattern that helps Angular components render safe loading, success, empty, and error branches.

---

#### The Real Bug TypeScript Caught

A useful example from this exercise is a typo in a status value.

Imagine writing:

```typescript
const loadingState: RequestState<Transaction[]> = {
  status: "loadnig",
};
```

TypeScript should flag this because `"loadnig"` is not one of the valid statuses.

The allowed values are:

```typescript
"idle" | "loading" | "success" | "empty" | "error";
```

This is a small typo, but it represents a real category of frontend bugs.

Without literal unions, the code might compile and run, but the UI would not match the intended state.

With TypeScript, the IDE can catch the mistake during development.

That is the point of modeling the domain carefully.

---

#### A Full Example to Learn From

Here is the full finance tracker model:

```typescript
type TransactionStatus = "pending" | "cleared" | "failed";

type TransactionType = "income" | "expense";

type TransactionCategory = "education" | "groceries" | "transportation" | "housing" | "entertainment" | "income" | "uncategorized";

type Transaction = {
  readonly id: number;
  readonly createdAt: string;
  merchant: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: TransactionCategory;
  notes?: string;
};

const trans1: Transaction = {
  id: 1,
  createdAt: "2026-01-01",
  merchant: "WalMart",
  amount: 12.99,
  type: "expense",
  status: "cleared",
  category: "entertainment",
  notes: "fun stuff",
};

const trans2: Transaction = {
  id: 2,
  createdAt: "2026-01-11",
  merchant: "Landlord",
  amount: 550.0,
  type: "expense",
  status: "pending",
  category: "housing",
  notes: "rent",
};

const trans3: Transaction = {
  id: 3,
  createdAt: "2026-01-21",
  merchant: "HyVee",
  amount: 12.99,
  type: "expense",
  status: "cleared",
  category: "groceries",
};

const trans4: Transaction = {
  id: 4,
  createdAt: "2026-01-30",
  merchant: "CarMax",
  amount: 15.99,
  type: "income",
  status: "failed",
  category: "transportation",
  notes: "refund",
};

const theTransactions = [trans1, trans2, trans3, trans4];

type RequestState<T> = { status: "idle" } | { status: "loading" } | { status: "success"; data: T } | { status: "empty" } | { status: "error"; message: string };

const transactionSuccess: RequestState<Transaction[]> = {
  status: "success",
  data: theTransactions,
};

const transactionError: RequestState<Transaction[]> = {
  status: "error",
  message: "No transactions",
};

const transactionEmpty: RequestState<Transaction[]> = {
  status: "empty",
};

type TransactionFilter = {
  status?: TransactionStatus;
  type?: TransactionType;
  category?: TransactionCategory;
  minAmount?: number;
  maxAmount?: number;
};

function filterTransactions(transactions: readonly Transaction[], filter: TransactionFilter): Transaction[] {
  return transactions.filter((transaction) => {
    if (filter.status && transaction.status !== filter.status) return false;
    if (filter.type && transaction.type !== filter.type) return false;
    if (filter.category && transaction.category !== filter.category) return false;

    if (filter.minAmount !== undefined && transaction.amount < filter.minAmount) {
      return false;
    }

    if (filter.maxAmount !== undefined && transaction.amount > filter.maxAmount) {
      return false;
    }

    return true;
  });
}

const clearedExpenses = filterTransactions(theTransactions, {
  status: "cleared",
  type: "expense",
});

const educationTransactions = filterTransactions(theTransactions, {
  category: "education",
});

type TransactionSortKey = "createdAt" | "amount" | "merchant";

type SortDirection = "asc" | "desc";

function sortTransactions(transactions: readonly Transaction[], sortKey: TransactionSortKey, direction: SortDirection = "asc"): Transaction[] {
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    if (sortKey === "amount") {
      comparison = a.amount - b.amount;
    }

    if (sortKey === "createdAt") {
      comparison = a.createdAt.localeCompare(b.createdAt);
    }

    if (sortKey === "merchant") {
      comparison = a.merchant.localeCompare(b.merchant);
    }

    return direction === "asc" ? comparison : -comparison;
  });
}

function renderTransactionState(state: RequestState<Transaction[]>): string {
  switch (state.status) {
    case "idle":
      return "No transactions requested yet.";

    case "loading":
      return "Loading transactions...";

    case "success":
      return `Loaded ${state.data.length} transactions.`;

    case "empty":
      return "No transactions found.";

    case "error":
      return `Error: ${state.message}`;
  }
}
```

This example shows how a few TypeScript tools work together:

- literal unions define valid values
- `readonly` protects identity fields
- generic request state models UI branches
- filter and sort function signatures guide valid usage
- readonly array parameters communicate non-mutating helpers
- discriminated unions make render logic safer

---

#### Common Things to Pay Attention To

#### 1. Sometimes people use plain strings where literal unions would be safer

This is loose:

```typescript
status: string;
```

This is safer:

```typescript
status: TransactionStatus;
```

The second version gives TypeScript a chance to catch typos and unsupported values.

---

#### 2. Sometimes people forget that TypeScript only enforces modeled rules

TypeScript can catch:

```typescript
status: "complete";
```

if `TransactionStatus` does not allow it.

But TypeScript cannot catch a business rule that was never expressed in the types.

If certain categories should only pair with certain transaction types, that rule needs to be modeled or validated separately.

---

#### 3. Sometimes people use truthy checks for numeric filters

This can be risky:

```typescript
if (filter.minAmount) {
  // ...
}
```

because `0` is falsy.

This is more precise:

```typescript
if (filter.minAmount !== undefined) {
  // ...
}
```

When working with numbers, be careful not to accidentally treat valid values as missing.

---

#### 4. Sometimes people forget that `.sort()` mutates arrays

JavaScript’s `.sort()` changes the array it is called on.

So this can mutate the original list:

```typescript
transactions.sort(...);
```

This is safer:

```typescript
return [...transactions].sort(...);
```

Copy first, then sort.

That is especially important in frontend state management, where accidental mutation can make UI bugs harder to track.

---

#### 5. Sometimes people make optional parameters without setting a default

This can create subtle behavior problems:

```typescript
direction?: SortDirection;
```

If the logic treats anything other than `"asc"` as descending, then `undefined` accidentally becomes descending.

This is clearer:

```typescript
direction: SortDirection = "asc";
```

Now the default behavior is explicit.

---

#### Why This Matters in Angular

Angular applications are full of domain models.

A component might need a typed transaction list.

A service might return a typed request state.

A template might render loading, success, empty, and error branches.

A helper function might filter or sort data before display.

This kind of TypeScript modeling helps because it makes the data contract clear before the code runs.

For example, an Angular service might eventually return something like:

```typescript
RequestState<Transaction[]>;
```

A component can then switch on the status:

```typescript
state.status;
```

and TypeScript can safely narrow the branch.

The success branch has data.

The error branch has a message.

The loading and empty branches do not pretend to have data they do not have.

That is the same pattern practiced in this finance tracker example.

---

#### Interview-Ready Explanation

A good answer to:

> Show how your types reduce bugs before runtime.

could sound like this:

> My types reduce bugs before runtime by making invalid values and invalid states harder to represent in the first place. Literal unions prevent mistakes like misspelling a request status as `"loadnig"` or passing an unsupported transaction status, category, or sort key. `readonly` fields protect identity values like `id` and `createdAt` from accidental reassignment during development. The `RequestState<T>` union makes UI states explicit, so the success branch requires data while the error branch requires a message. Function signatures for filtering and sorting also make it clear what inputs are allowed, and TypeScript catches incorrect usage before the JavaScript runs.

---

#### Final Takeaway

The biggest takeaway is that TypeScript is most useful when it models real application rules.

A finance tracker is not just a list of objects.

It has allowed statuses, allowed categories, request states, filters, sort keys, and identity fields.

When those ideas are represented in the type system, TypeScript can catch mistakes earlier.

That is how types reduce runtime bugs:

- invalid statuses fail earlier
- invalid categories fail earlier
- invalid sort keys fail earlier
- readonly fields resist accidental reassignment
- render functions only access data in the correct branch
- helper functions communicate what they accept and return

The more accurately the types describe the domain, the harder it becomes to write incorrect code by accident.
