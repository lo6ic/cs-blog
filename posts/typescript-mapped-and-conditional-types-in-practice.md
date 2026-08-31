---
title: "TypeScript Mastery: Mapped and Conditional Types in Practice"
description: "A practical teaching article on TypeScript mapped and conditional types, including keyof, T[K], infer, form error models, and extracting array element types without duplicating type definitions."
published: true
datePublished: "August 30, 2026"
picture: "assets/posts/react2.jpg"
tags:
  - typescript
  - mapped-types
  - conditional-types
displayOrder: 1
---

# TypeScript Mastery: Mapped and Conditional Types in Practice

August 30, 2026

TypeScript becomes especially useful when related application types can be derived from one another instead of being maintained separately.

Utility types such as `Partial`, `Pick`, and `Readonly` demonstrate this idea at a high level. Mapped and conditional types expose some of the underlying tools that make these kinds of transformations possible.

The practical mental models are:

```text
Mapped type = take existing keys and transform their properties.

Conditional type = choose a resulting type based on a type-level condition.
```

These features can become extremely advanced, but most frontend applications do not need type-system gymnastics. The useful goal is to recognize the patterns, understand what they accomplish, and use them when they remove duplication or make application intent clearer.

---

## Start With a Frontend Problem

Consider a registration form:

```typescript
type RegistrationForm = {
  username: string;
  email: string;
  password: string;
  age: number;
};
```

The application may also need an object containing validation errors for these fields.

A manually written version could look like this:

```typescript
type RegistrationErrors = {
  username?: string;
  email?: string;
  password?: string;
  age?: string;
};
```

This works, but it duplicates every property name from `RegistrationForm`.

A mapped type can derive the error structure directly from the form model.

---

## Mapped Types: Transform the Properties of Another Type

```typescript
type ValidationErrors<T> = {
  [K in keyof T]?: string;
};
```

Then:

```typescript
type RegistrationErrors = ValidationErrors<RegistrationForm>;
```

effectively produces:

```typescript
type RegistrationErrors = {
  username?: string;
  email?: string;
  password?: string;
  age?: string;
};
```

A useful way to read the mapped-type syntax is:

```text
For every key K that exists in T,
create that property in the new type,
make it optional,
and give it a string value.
```

A valid error object can therefore contain only the fields that currently have errors:

```typescript
const errors: RegistrationErrors = {
  email: "Please enter a valid email address",
  password: "Password must contain at least 8 characters",
};
```

---

## Understanding `[K in keyof T]`

Given:

```typescript
type RegistrationForm = {
  username: string;
  email: string;
  password: string;
  age: number;
};
```

then:

```typescript
keyof RegistrationForm
```

represents:

```typescript
"username" | "email" | "password" | "age";
```

The syntax:

```typescript
[K in keyof T]
```

means:

> For each key `K` in the keys of `T`, create a property for that key.

The full expression:

```typescript
[K in keyof T]?: string;
```

adds two decisions:

```text
?       = make the property optional
string  = make its resulting value a string
```

---

## Mapped Types Can Change the Original Value Types

One important detail is that a mapped type can keep the original property names while completely changing their value types.

The original form contains:

```typescript
age: number;
```

But the mapped error model says:

```typescript
[K in keyof T]?: string;
```

Therefore this fails:

```typescript
// const errors: RegistrationErrors = {
//   age: 21,
// };
```

The error model is not asking for the user's age. It is asking for an error message associated with the `age` field.

This works:

```typescript
const errors: RegistrationErrors = {
  age: "You must be at least 18 years old",
};
```

---

## Preserving Original Value Types With `T[K]`

Sometimes the goal is to keep each property's original type while making every field optional.

```typescript
type OptionalVersion<T> = {
  [K in keyof T]?: T[K];
};
```

Now:

```typescript
type OptionalRegistrationForm = OptionalVersion<RegistrationForm>;
```

behaves roughly like:

```typescript
type OptionalRegistrationForm = {
  username?: string;
  email?: string;
  password?: string;
  age?: number;
};
```

The important distinction is:

```typescript
type ValidationErrors<T> = {
  [K in keyof T]?: string;
};
```

versus:

```typescript
type OptionalVersion<T> = {
  [K in keyof T]?: T[K];
};
```

The first says:

```text
Keep the keys, but every resulting value is a string.
```

The second says:

```text
Keep the keys and preserve the original value type for each key.
```

This builds on the useful indexed-access mental model:

```text
T = the object type
K = one key from that object
T[K] = the value type associated with that specific key
```

---

## Mapped Types and Utility Types

Mapped types help explain how common TypeScript utility types can transform an existing model.

For example, a simplified `Partial<T>` can be expressed as:

```typescript
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

The important idea is not to memorize TypeScript's internal implementations.

The useful connection is:

> Utility types give us common transformations. Mapped types let us define our own transformations.

A custom mapped type is useful when an application has a recurring relationship that a built-in utility type does not directly represent.

---

## Conditional Types: A Type-Level Decision

Conditional types introduce another form of transformation.

Their syntax resembles JavaScript's ternary operator:

```typescript
condition ? valueIfTrue : valueIfFalse;
```

A TypeScript conditional type looks like:

```typescript
type SomeType<T> = T extends Something ? TypeIfTrue : TypeIfFalse;
```

A useful mental model is:

```text
Does T satisfy this type condition?

Yes → produce one type.
No  → produce another type.
```

For example:

```typescript
type IsString<T> = T extends string ? true : false;
```

Then:

```typescript
type A = IsString<string>; // true
type B = IsString<number>; // false
```

The conditional type is not necessarily returning `T`. It chooses between the two types specified in its true and false branches.

---

## What Does `extends` Mean Here?

In:

```typescript
T extends string ? true : false
```

a useful way to read `extends` is:

> Is `T` assignable to, or compatible with, `string`?

So:

```text
string extends string? → yes → true
number extends string? → no  → false
```

This is related to a generic constraint such as:

```typescript
K extends keyof T
```

but the role is different.

In a generic constraint, `K` is being restricted to valid keys of `T`.

In a conditional type, the check determines which resulting type to produce.

---

## `infer`: Let TypeScript Extract a Type

Conditional types become especially useful with `infer`.

Suppose a reusable type needs to extract `Customer` from `Customer[]`.

```typescript
type Customer = {
  id: number;
  name: string;
  email: string;
};
```

That can be written as:

```typescript
type ArrayItem<T> = T extends Array<infer U> ? U : T;
```

A practical way to read this is:

```text
Does T look like an array containing some element type?

If yes:
  infer that element type as U
  and return U.

If no:
  return T unchanged.
```

For example:

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};

type W = ArrayItem<Product[]>; // Product
type X = ArrayItem<string[]>; // string
type Y = ArrayItem<number[]>; // number
type Z = ArrayItem<Product>; // Product
```

The useful mental model for `infer` is:

> TypeScript, figure out this inner type for me.

More precisely, `infer U` asks TypeScript to infer the element type that satisfies the array pattern and make that type available as `U`.

---

## A Practical API Example

Frontend applications frequently receive arrays of domain objects from APIs.

```typescript
type ApiResponse<T> = {
  data: T;
  success: boolean;
};

type Customer = {
  id: number;
  name: string;
  email: string;
};
```

A reusable conditional type can extract an item type when `T` is an array:

```typescript
type ResponseItem<T> = T extends Array<infer U> ? U : T;
```

Now:

```typescript
type CustomerItem = ResponseItem<Customer[]>;
type StringItem = ResponseItem<string[]>;
type NumberItem = ResponseItem<number[]>;
type SingleCustomer = ResponseItem<Customer>;
```

The resulting types are:

```text
CustomerItem    = Customer
StringItem      = string
NumberItem      = number
SingleCustomer  = Customer
```

For:

```typescript
ResponseItem<Customer[]>;
```

TypeScript checks whether `Customer[]` matches:

```typescript
Array<infer U>;
```

It does, so TypeScript infers:

```text
U = Customer
```

and returns `Customer`.

---

## The False Branch Is a Design Decision

This implementation uses:

```typescript
type ArrayItem<T> = T extends Array<infer U> ? U : T;
```

That means a non-array type is returned unchanged:

```typescript
type Result = ArrayItem<boolean>; // boolean
```

But that behavior is not required.

The type could instead say that non-arrays are invalid:

```typescript
type StrictArrayItem<T> = T extends Array<infer U> ? U : never;
```

Then:

```typescript
type Result = StrictArrayItem<boolean>; // never
```

Neither version is universally correct.

The important question is:

> What should this reusable type mean in this application?

Type transformations should model application intent, not simply demonstrate clever syntax.

---

## Full Example

```typescript
type RegistrationForm = {
  username: string;
  email: string;
  password: string;
  age: number;
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

type RegistrationErrors = ValidationErrors<RegistrationForm>;

const errors: RegistrationErrors = {
  email: "Please enter a valid email address",
  password: "Password must contain at least 8 characters",
};

type OptionalVersion<T> = {
  [K in keyof T]?: T[K];
};

type OptionalRegistrationForm = OptionalVersion<RegistrationForm>;

const draft: OptionalRegistrationForm = {
  username: "Chris",
  age: 21,
};

type IsString<T> = T extends string ? true : false;

type StringCheck = IsString<string>; // true
type NumberCheck = IsString<number>; // false

type Customer = {
  id: number;
  name: string;
  email: string;
};

type ResponseItem<T> = T extends Array<infer U> ? U : T;

type CustomerItem = ResponseItem<Customer[]>;
type StringItem = ResponseItem<string[]>;
type NumberItem = ResponseItem<number[]>;
type SingleCustomer = ResponseItem<Customer>;
```

---

## Common Things to Pay Attention To

### Mapped types can change value types

This:

```typescript
[K in keyof T]?: string
```

does not preserve `T`'s original property value types.

Every resulting value is a string.

If the original value types should be preserved, use:

```typescript
[K in keyof T]?: T[K]
```

### Conditional types do not automatically return the original type

This:

```typescript
T extends string ? "yes" : "no"
```

returns `"yes"` or `"no"`.

The original type is only returned when one of the branches explicitly says to return `T`.

### `infer` extracts a type from a matching pattern

In:

```typescript
T extends Array<infer U> ? U : T
```

`infer U` means:

> If `T` matches this array pattern, determine the array's element type and call it `U`.

### Avoid overengineering

Mapped and conditional types can become difficult to read very quickly.

A complicated generic type is not automatically better code. If a straightforward interface or built-in utility type clearly expresses the application model, use it.

Reach for custom mapped or conditional types when they eliminate meaningful duplication, encode a useful relationship, or improve type safety without making the code harder for the team to understand.

---

## Why This Matters in Angular

Angular applications contain many related models:

```text
domain models
API responses
form values
validation errors
component state
view models
table rows
select options
request state
```

Mapped types can derive related structures from a source model.

For example:

```typescript
type FormErrors<T> = {
  [K in keyof T]?: string;
};
```

An Angular form model can now have a corresponding error model without manually repeating every field.

Conditional types can help reusable utilities adapt to the shape of data they receive.

```typescript
type ResponseItem<T> = T extends Array<infer U> ? U : T;
```

The larger benefit is consistency. Instead of maintaining several unrelated definitions that happen to describe the same domain, TypeScript can model the relationships between them.

---

## Interview-Ready Explanation

A mapped type creates a new type by iterating over the properties of an existing type and defining how those properties should look in the resulting type. For example, a form-error mapped type can take every key from a form model, make it optional, and change its value to a string error message. `[K in keyof T]` means that for every valid key in `T`, TypeScript should create a corresponding property in the new type.

A conditional type works similarly to a ternary expression at the type level. It checks whether a type satisfies a condition and chooses one resulting type when the condition matches and another when it does not. `infer` can be used inside that condition to extract part of a matching type, such as determining the element type inside an array.

---

## Final Takeaway

Mapped and conditional types are tools for describing relationships between types.

Use a mapped type when the question is:

```text
How should I transform the properties of this existing type?
```

Think:

```typescript
[K in keyof T]
```

as:

```text
For every key in T...
```

Use a conditional type when the question is:

```text
Which type should result depending on what T looks like?
```

Think:

```typescript
T extends Something ? A : B
```

as a type-level ternary.

And when `infer` appears:

```typescript
T extends Array<infer U> ? U : T
```

think:

```text
If this pattern matches, TypeScript should figure out the inner type and give it a name.
```

The deeper lesson is not to write the most advanced type possible.

> Use TypeScript's type-transformation tools when they make relationships clearer, reduce duplication, and help the compiler enforce the same structure the application already expects.
