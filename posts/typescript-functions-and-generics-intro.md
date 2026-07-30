---
title: "TypeScript Mastery: Functions and Generics Intro"
description: "A practical teaching article on typed functions, generic helpers, pluck-by-key utilities, API response wrappers, and how generics preserve type information while keeping code reusable."
published: true
datePublished: "July 30, 2026"
picture: "assets/posts/backshift.jpg"
---

### TypeScript Mastery: Functions and Generics Intro

July 30, 2026

Generics are one of the TypeScript topics that can feel abstract at first.

The syntax can look intimidating:

```typescript
function mapApiResponse<T, U>(response: ApiResponse<T>, mapper: (data: T) => U): ApiResponse<U> {
  // ...
}
```

But the core idea is practical:

> Generics let code stay reusable without losing type information.

That matters a lot in frontend and Angular development.

Angular applications often fetch data from APIs, map raw responses into UI-ready models, and pass typed data through services, components, and utility functions. Without generics, reusable helpers often become too specific, or they fall back to broad types like `any` or `unknown`.

Generics solve that problem by letting a function or type say:

> I do not know the exact type yet, but once you give it to me, I will preserve it and use it consistently.

This lesson focuses on typed functions, generic helpers, `pluck` by key, and safe API response wrappers.

---

#### Start with Typed Functions

Before learning generics, it helps to start with normal typed functions.

Here is a simple currency formatter:

```typescript
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

console.log(formatCurrency(19));
console.log(formatCurrency(20.99));
```

This function has a clear contract:

```typescript
amount: number;
```

means the function expects a number.

```typescript
: string
```

means the function returns a string.

So the function can be read like this:

> Give me a number, and I will return a formatted currency string.

Another example is a boolean helper:

```typescript
function isPositive(value: number): boolean {
  return value > 0;
}
```

This says:

> Give me a number, and I will return `true` or `false`.

A highlight I want to bring up is that not every function needs to be generic. If a function only works with numbers, strings, or one specific model, a normal typed function is often the clearest option.

Generics become useful when the function needs to work across many types while still preserving the relationship between input and output.

---

#### The First Generic: `identity`

The classic starter example for generics is an `identity` function.

```typescript
function identity<T>(value: T): T {
  return value;
}
```

The `T` is a type parameter.

It acts like a placeholder for whatever type is passed in.

```typescript
const name = identity("Angular");
const count = identity(19);
const active = identity(true);
```

TypeScript can infer:

```typescript
const name: string;
const count: number;
const active: boolean;
```

The function is reusable, but it does not throw away the type information.

A simple way to read this is:

> Whatever type goes in is the same type that comes back out.

That is different from writing:

```typescript
function identity(value: any): any {
  return value;
}
```

Using `any` may seem flexible, but it also turns off the useful type checking. Generics give flexibility while keeping the type system involved.

---

#### Generic Helpers Should Tell the Truth

Another useful generic helper is `firstItem`.

```typescript
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}
```

This function accepts an array of `T` and returns either the first item or `undefined`.

Why `undefined`?

Because the array might be empty.

```typescript
const firstNumber = firstItem([10, 20, 30]);
const firstString = firstItem(["Angular", "TypeScript"]);
const empty = firstItem([]);
```

The return type should tell the truth:

```typescript
T | undefined;
```

A highlight I want to bring up is that sometimes people want to write this as returning only `T`.

```typescript
function firstItem<T>(items: T[]): T {
  return items[0];
}
```

That looks cleaner, but it hides a real possibility. If the array is empty, there is no first item. TypeScript is most useful when the type accurately represents what can happen.

---

#### A Practical Generic: `pluck`

A very useful generic helper is a function that pulls one property from an object.

```typescript
function pluck<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}
```

This can look complicated, so it helps to break it into pieces.

```typescript
T;
```

represents the object type.

```typescript
K extends keyof T
```

means the key must be one of the real keys on that object.

```typescript
T[K];
```

means the return type is the type of that specific property.

Here is an example:

```typescript
type BudgetItem = {
  readonly id: number;
  label: string;
  amount: number;
  category: string;
};

const budgetItem: BudgetItem = {
  id: 1,
  label: "Angular Course",
  amount: 49.99,
  category: "Education",
};

const label = pluck(budgetItem, "label");
const amount = pluck(budgetItem, "amount");
```

TypeScript understands:

```typescript
const label: string;
const amount: number;
```

That is the value of this generic helper.

It does not just return “some property.” It returns the correctly typed property.

This should fail:

```typescript
const bad = pluck(budgetItem, "missingKey");
```

Why?

Because `"missingKey"` is not one of the keys of `BudgetItem`.

A highlight I want to bring up is that this is where generics start to show their real value. The function is reusable for many object types, but TypeScript still protects the relationship between the object, the key, and the return value.

---

#### Modeling an API Response with a Generic

Frontend code often needs to model API responses.

A response may succeed with data, or it may fail with a message.

That can be modeled with a discriminated union and a generic:

```typescript
type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; message: string };
```

The `T` represents the success data.

So this:

```typescript
type User = {
  readonly id: number;
  name: string;
  email: string;
};

const userSuccess: ApiResponse<User> = {
  status: "success",
  data: {
    id: 1,
    name: "Chris",
    email: "chris@test.com",
  },
};
```

means:

> This is one API response where the success data is a `User`.

This:

```typescript
const userError: ApiResponse<User> = {
  status: "error",
  message: "There was an error with this user.",
};
```

means:

> This is still an API response for a `User` request, but it failed, so it has a message instead of data.

And this:

```typescript
const usersSuccess: ApiResponse<User[]> = {
  status: "success",
  data: [
    {
      id: 2,
      name: "Joe",
      email: "joe@joe.com",
    },
    {
      id: 3,
      name: "Kate",
      email: "kate@kate.com",
    },
  ],
};
```

means:

> This is one API response where the success data is an array of users.

---

#### Common Confusion: `ApiResponse<User[]>` vs `ApiResponse<User>[]`

This is a very important distinction.

Sometimes people first try to write something like this:

```typescript
const usersSuccess: ApiResponse<User[]> = [
  {
    status: "success",
    data: {
      id: 2,
      name: "Joe",
      email: "joe@joe.com",
    },
  },
  {
    status: "success",
    data: {
      id: 3,
      name: "Kate",
      email: "kate@kate.com",
    },
  },
];
```

That does not match the declared type.

The type says:

```typescript
ApiResponse<User[]>;
```

Read that as:

> One API response whose `data` property is a `User[]`.

So the outer shape should be one response object:

```typescript
{
  status: "success",
  data: [...]
}
```

The array belongs inside the `data` property.

The correct version is:

```typescript
const usersSuccess: ApiResponse<User[]> = {
  status: "success",
  data: [
    {
      id: 2,
      name: "Joe",
      email: "joe@joe.com",
    },
    {
      id: 3,
      name: "Kate",
      email: "kate@kate.com",
    },
  ],
};
```

The incorrect version is closer to this type:

```typescript
ApiResponse < User > [];
```

Read that as:

> An array of API responses, where each response contains one `User`.

That would look like this:

```typescript
const manyUserResponses: ApiResponse<User>[] = [
  {
    status: "success",
    data: {
      id: 2,
      name: "Joe",
      email: "joe@joe.com",
    },
  },
  {
    status: "success",
    data: {
      id: 3,
      name: "Kate",
      email: "kate@kate.com",
    },
  },
];
```

These are different shapes:

```typescript
ApiResponse<User>;
```

means one response containing one user.

```typescript
ApiResponse<User[]>;
```

means one response containing many users in its `data` property.

```typescript
ApiResponse < User > [];
```

means many response objects, each containing one user.

A simple mental model is:

> `ApiResponse<T>` is the box.  
> `T` is what goes inside the `data` property when the response succeeds.

So if `T` is `User[]`, then `data` must be a user array.

---

#### Rendering an API Response

A simple render helper can use narrowing on the `status` field:

```typescript
function renderApiResponse<T>(response: ApiResponse<T>): string {
  switch (response.status) {
    case "success":
      return "Success";

    case "error":
      return `Error: ${response.message}`;
  }
}
```

In the success branch, TypeScript knows the response has `data`.

In the error branch, TypeScript knows the response has `message`.

This connects directly to discriminated unions from the previous lesson.

---

#### Mapping an API Response

Now for the harder generic helper:

```typescript
function mapApiResponse<T, U>(response: ApiResponse<T>, mapper: (data: T) => U): ApiResponse<U> {
  if (response.status === "error") {
    return {
      status: "error",
      message: response.message,
    };
  }

  return {
    status: "success",
    data: mapper(response.data),
  };
}
```

This function is important because it models a common frontend flow:

```text
API response of raw data
↓
map the success data
↓
keep the same success/error wrapper
```

The generic types have different jobs.

```typescript
T;
```

is the original data type.

```typescript
U;
```

is the transformed data type.

So the function reads like this:

> Take an `ApiResponse<T>`.  
> If it succeeded, use a mapper function to turn `T` into `U`.  
> Return an `ApiResponse<U>`.  
> If it failed, keep the error message.

---

#### Understanding `mapper: (data: T) => U`

This line is often the hardest part to understand:

```typescript
mapper: (data: T) => U;
```

It means:

> `mapper` is a function parameter.

That function receives data of type `T`.

That function returns a value of type `U`.

So `mapper` is not the data itself. It is the transformation recipe.

A smaller example helps:

```typescript
function transform<T, U>(value: T, mapper: (data: T) => U): U {
  return mapper(value);
}
```

This function says:

> Give me a value.  
> Give me a function that knows how to transform that value.  
> I will call that function and return the transformed result.

Example:

```typescript
const result = transform(10, (value) => value.toString());
```

Here, TypeScript figures out:

```typescript
T = number;
U = string;
```

Why?

Because the input value is a number, and the mapper returns a string.

So this:

```typescript
const result = transform(10, (value) => value.toString());
```

has a result type of:

```typescript
string;
```

Now apply that idea back to `mapApiResponse`.

```typescript
const mappedName = mapApiResponse(userSuccess, (user) => user.name);
```

The response is:

```typescript
ApiResponse<User>;
```

So:

```typescript
T = User;
```

The mapper is:

```typescript
(user) => user.name;
```

That function takes a `User` and returns a `string`.

So:

```typescript
U = string;
```

Therefore the result is:

```typescript
ApiResponse<string>;
```

A second example:

```typescript
const mappedEmails = mapApiResponse(usersSuccess, (users) => users.map((user) => user.email));
```

The response is:

```typescript
ApiResponse<User[]>;
```

So:

```typescript
T = User[]
```

The mapper takes a user array and returns an array of email strings:

```typescript
(users) => users.map((user) => user.email);
```

So:

```typescript
U = string[]
```

The result is:

```typescript
ApiResponse<string[]>;
```

A highlight I want to bring up is that the generic helper does not need to know the details of the transformation. It only needs a function that can turn `T` into `U`.

That is what this part promises:

```typescript
mapper: (data: T) => U;
```

---

#### A Full Example to Learn From

Here is the complete version:

```typescript
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function isPositive(value: number): boolean {
  return value > 0;
}

function identity<T>(value: T): T {
  return value;
}

function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

type BudgetItem = {
  readonly id: number;
  label: string;
  amount: number;
  category: string;
};

function pluck<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}

const budgetItem: BudgetItem = {
  id: 1,
  label: "Angular Course",
  amount: 49.99,
  category: "Education",
};

const label = pluck(budgetItem, "label");
const amount = pluck(budgetItem, "amount");

type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; message: string };

type User = {
  readonly id: number;
  name: string;
  email: string;
};

const userSuccess: ApiResponse<User> = {
  status: "success",
  data: {
    id: 1,
    name: "Chris",
    email: "chris@test.com",
  },
};

const usersSuccess: ApiResponse<User[]> = {
  status: "success",
  data: [
    {
      id: 2,
      name: "Joe",
      email: "joe@joe.com",
    },
    {
      id: 3,
      name: "Kate",
      email: "kate@kate.com",
    },
  ],
};

function renderApiResponse<T>(response: ApiResponse<T>): string {
  switch (response.status) {
    case "success":
      return "Success";

    case "error":
      return `Error: ${response.message}`;
  }
}

function mapApiResponse<T, U>(response: ApiResponse<T>, mapper: (data: T) => U): ApiResponse<U> {
  if (response.status === "error") {
    return {
      status: "error",
      message: response.message,
    };
  }

  return {
    status: "success",
    data: mapper(response.data),
  };
}

const mappedName = mapApiResponse(userSuccess, (user) => user.name);

const mappedEmails = mapApiResponse(usersSuccess, (users) => users.map((user) => user.email));

console.log(mappedName);
console.log(mappedEmails);
```

This example shows the main generics lesson:

> Reusable helpers can stay flexible while still preserving specific types.

---

#### Common Things to Pay Attention To

#### 1. Sometimes people use `any` when they really need a generic

This gives flexibility:

```typescript
function identity(value: any): any {
  return value;
}
```

But it loses the type relationship.

This preserves the relationship:

```typescript
function identity<T>(value: T): T {
  return value;
}
```

A generic says:

> I can work with many types, but I still care which type you gave me.

---

#### 2. Sometimes people confuse the response wrapper with the data inside it

This is one response containing an array:

```typescript
ApiResponse<User[]>;
```

This is an array of responses:

```typescript
ApiResponse < User > [];
```

They are not the same shape.

A good question to ask is:

> Is the array the response itself, or is the array inside the `data` property?

Most API response wrappers are one object with data inside them.

---

#### 3. Sometimes people read `mapper` as if it were data

In this line:

```typescript
mapper: (data: T) => U;
```

`mapper` is a function.

It is a transformation recipe.

It says:

> Give me `T`, and I will return `U`.

That is why this works:

```typescript
mapApiResponse(userSuccess, (user) => user.name);
```

The mapper turns a `User` into a `string`.

---

#### 4. Sometimes people forget that generics describe relationships

The most important part of generics is not the angle brackets.

It is the relationship.

```typescript
function firstItem<T>(items: T[]): T | undefined;
```

means:

> The array contains `T`, so the first item is `T` or `undefined`.

```typescript
function pluck<T, K extends keyof T>(item: T, key: K): T[K];
```

means:

> The key must belong to the object, and the return type matches that property.

```typescript
function mapApiResponse<T, U>(response: ApiResponse<T>, mapper: (data: T) => U): ApiResponse<U>;
```

means:

> The response starts with `T`, the mapper turns `T` into `U`, and the result wraps `U`.

---

#### Why This Matters in Angular

Generics show up constantly in Angular and TypeScript-heavy frontend code.

For example, Angular HTTP calls commonly use generic type parameters:

```typescript
this.http.get<User[]>("/api/users");
```

The idea is:

> This request should return an array of users.

Generic response wrappers are also useful when modeling shared service results:

```typescript
type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; message: string };
```

A service might return:

```typescript
ApiResponse<User>;
```

or:

```typescript
ApiResponse<User[]>;
```

or:

```typescript
ApiResponse<UserViewModel>;
```

without rewriting the same response shape over and over.

Generics also help with reusable utilities:

- extracting values from objects
- mapping API responses
- wrapping values
- working with lists
- preserving type information across transformations

This is why generics are an important step toward writing stronger Angular services and shared frontend utilities.

---

#### Interview-Ready Explanation

A good interview answer to:

> What problem do generics solve?

could sound like this:

> Generics solve the problem of writing reusable code without losing type information. Without generics, developers often have to duplicate similar functions for different types or fall back to broad types like `any` or `unknown`, which weakens type safety. A generic lets a function or type accept a type parameter, so TypeScript can connect the input type to the output type. For example, `ApiResponse<T>` can wrap a `User`, a `User[]`, or a string while still keeping the `data` property strongly typed. This is especially useful in Angular services and shared utilities because it allows reusable code to stay flexible without becoming loosely typed.

---

#### Final Takeaway

The biggest takeaway is that generics preserve useful type relationships.

They are not just “advanced TypeScript syntax.”

They answer practical questions like:

- If this function receives a string, can it return a string?
- If this function receives a `User[]`, can it return the first `User` safely?
- If this helper receives an object and a key, can it return the correct property type?
- If an API response wraps `User[]`, can the `data` property stay typed as `User[]`?
- If a mapper turns `User` into `string`, can the response become `ApiResponse<string>`?

That is why generics are so useful.

They let code stay reusable, but still precise.
