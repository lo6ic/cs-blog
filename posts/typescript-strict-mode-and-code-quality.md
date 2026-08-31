---
title: "TypeScript Mastery: Strict Mode and Code Quality"
description: "A practical guide to TypeScript strict mode, tsconfig compiler settings, implicit any, null and undefined safety, strict property initialization, optional chaining, and catching potential runtime bugs during development."
published: true
datePublished: "August 30, 2026"
picture: "assets/posts/hooks.jpg"
tags:
  - typescript
  - strict-mode
  - code-quality
displayOrder: 3
---

# TypeScript Mastery: Strict Mode and Code Quality

August 30, 2026

TypeScript provides static type checking, but the compiler configuration determines how aggressively those types are enforced.

That configuration lives primarily in `tsconfig.json`.

For production applications, enabling strict type checking helps developers get more of the safety TypeScript is designed to provide. Instead of allowing potentially unsafe assumptions to pass silently, the compiler can identify problems during development that might otherwise become JavaScript runtime errors.

The goal is not to memorize every TypeScript compiler option.

The more useful goal is to understand what strictness protects against and how those protections influence everyday TypeScript and Angular code.

---

## What Does `tsconfig.json` Do?

`tsconfig.json` configures the TypeScript compiler.

A simplified configuration might look like:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ES2022"
  }
}
```

There are many available compiler options, but one particularly important setting is:

```json
"strict": true
```

A useful mental model is:

> `tsconfig.json` defines the rules TypeScript uses when checking and compiling the project.

---

## `strict` Is a Collection of Stronger Checks

`strict` is not simply one individual validation.

It acts as a master setting for a collection of stricter type-checking behaviors.

At a practical level, strict TypeScript helps enforce ideas such as:

```text
Do not silently allow unsafe `any` values.

Take null and undefined seriously.

Check function contracts more carefully.

Make sure required class properties are initialized safely.
```

These checks make the compiler more willing to stop and ask:

> Can you actually guarantee this value has the type you claim it has?

That is one of the major benefits of TypeScript.

---

## Avoiding Implicit `any`

Consider this function:

```typescript
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

There is no explicit contract for the parameters.

What is `price`?

What is `quantity`?

Without sufficient type checking, those parameters can become unsafe `any` values and TypeScript loses much of its ability to protect the function.

A safer version is:

```typescript
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
```

Now the type signature establishes a clear contract:

```text
number + number → number
```

This invalid call can be caught during development:

```typescript
calculateTotal("10", 5);
```

A useful mental model from earlier TypeScript lessons still applies:

> A type signature is a contract.

Strict checking helps prevent code from quietly escaping that contract.

---

## Another Implicit `any` Example

Consider:

```typescript
function greet(name) {
  return name.toUpperCase();
}
```

Without a useful type for `name`, code could attempt:

```typescript
greet(123);
```

The call to:

```typescript
name.toUpperCase();
```

would then fail at runtime because a number does not provide that string method.

The function should communicate what it accepts:

```typescript
function greet(name: string): string {
  return name.toUpperCase();
}
```

Now the contract is:

```text
string → string
```

and an invalid call can be caught by the compiler.

---

## Strict Null and Undefined Checking

Nullability is another important area where strict checking provides protection.

Consider:

```typescript
type User = {
  name: string;
};

function getUserName(user?: User): string {
  return user.name;
}
```

The parameter:

```typescript
user?: User
```

means the function may receive either:

```text
User | undefined
```

Therefore this operation is unsafe:

```typescript
user.name;
```

because `user` might be `undefined`.

The compiler is forcing the code to acknowledge that possibility instead of assuming the value exists.

---

## Optional Chaining and Nullish Coalescing

One solution is:

```typescript
function getUserName(user?: User): string {
  return user?.name ?? "";
}
```

Optional chaining:

```typescript
user?.name;
```

means:

> If `user` exists, access `name`. Otherwise produce `undefined`.

Nullish coalescing:

```typescript
?? ""
```

then provides a fallback when the value is `null` or `undefined`.

The final function still guarantees its declared return type:

```text
string
```

---

## `||` vs. `??`

It is also useful to distinguish logical OR from nullish coalescing.

```text
|| → fallback for falsy values

?? → fallback only for null or undefined
```

For example:

```typescript
const value = user?.name ?? "";
```

is often more precise when the actual concern is whether a value is missing.

`||` also treats values such as an empty string, `0`, and `false` as reasons to use the fallback.

When the business rule is specifically about `null` or `undefined`, `??` communicates that intent more accurately.

---

## Strict Property Initialization

Strictness also matters when working with classes.

Consider:

```typescript
class UserProfile {
  name: string;

  constructor() {}
}
```

The declaration:

```typescript
name: string;
```

makes a promise:

> Every valid `UserProfile` instance has a string in `name`.

But the constructor does not actually fulfill that promise.

A safe solution is:

```typescript
class UserProfile {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
```

Now every constructed `UserProfile` receives a valid `name`.

The mental model is:

> Strict property initialization checks that required class properties are definitely assigned before construction finishes.

---

## Other Valid Initialization Patterns

A property can also be initialized immediately:

```typescript
class UserProfile {
  name = "";
}
```

Or TypeScript's constructor parameter-property syntax can declare and initialize it at once:

```typescript
class UserProfile {
  constructor(public name: string) {}
}
```

All of these approaches establish a valid initial value.

The important question is whether the class can actually guarantee the property exists in the state promised by its type.

---

## Optional Properties Require Careful Handling

Consider an API model:

```typescript
type Product = {
  id: number;
  name: string;
  price?: number;
};
```

Because `price` is optional:

```typescript
price?: number;
```

its effective type when accessed is:

```text
number | undefined
```

Now consider:

```typescript
function formatProduct(product: Product): string {
  return product.name + " - $" + product.price.toFixed(2);
}
```

The function parameter itself is safe:

```typescript
product: Product;
```

The uncertainty is specifically:

```typescript
product.price;
```

because the property may be undefined.

A safe implementation is:

```typescript
function formatProduct(product: Product): string {
  const formattedPrice = product.price?.toFixed(2) ?? "0.00";

  return `${product.name} - $${formattedPrice}`;
}
```

If `price` exists, `toFixed(2)` formats it.

If `price` is undefined, optional chaining produces `undefined`, and `?? "0.00"` supplies the fallback.

---

## Put Optional Chaining Where the Uncertainty Exists

This distinction is subtle but important.

If the function declares:

```typescript
product: Product;
```

then `product` itself is required.

Writing:

```typescript
product?.price;
```

asks:

> What if `product` does not exist?

But that is not what the type contract says.

The optional value is:

```typescript
product.price;
```

Therefore the useful check is:

```typescript
product.price?.toFixed(2);
```

A good rule is:

> Put optional chaining at the point where the type can actually be null or undefined.

This keeps the implementation aligned with the type contract instead of defensively checking values that TypeScript already guarantees.

---

## Why Strict Mode Improves Code Quality

Strict mode makes TypeScript more effective as a development tool.

It can expose unsafe assumptions involving:

- implicit `any`
- potentially missing values
- optional properties
- null and undefined
- class initialization
- function contracts

These checks move certain failures earlier in the development process.

Instead of discovering a problem after JavaScript is running:

```text
Write code
   ↓
Run application
   ↓
Reach problematic state
   ↓
Runtime error
```

TypeScript may be able to move the feedback earlier:

```text
Write code
   ↓
Compiler analyzes types
   ↓
Potential problem identified
   ↓
Fix before runtime
```

This does not mean strict TypeScript eliminates runtime bugs.

It means the compiler can catch a category of problems that can be identified through static type analysis before the JavaScript executes.

---

## Why This Matters in Angular

Angular applications frequently contain:

- API response models
- services
- components
- dependency-injected classes
- optional server data
- form state
- asynchronous data
- application state that changes over time

Those are all places where incorrect assumptions about values can become runtime problems.

For example, API data may not yet exist when a component first evaluates some logic.

A strict type such as:

```typescript
user: User | undefined;
```

forces the code to acknowledge that lifecycle:

```typescript
const displayName = this.user?.name ?? "Loading...";
```

Instead of pretending `user` always exists, the type communicates the actual state the application can be in.

That makes the code easier to reason about and safer to refactor.

---

## Common Things to Pay Attention To

### Do not use `any` simply to silence the compiler

This:

```typescript
function process(value: any): any {
  // ...
}
```

may remove compiler complaints, but it also removes much of TypeScript's protection.

A compiler error is often useful information about an assumption that has not been modeled correctly.

---

### Optional does not mean guaranteed

If a property is declared:

```typescript
price?: number;
```

then code consuming it must account for the possibility that it is undefined.

Do not immediately call methods on it as though it were always a number.

---

### Do not add optional chaining everywhere

Optional chaining is useful when the value is genuinely nullable or optional.

If a function requires:

```typescript
product: Product;
```

then treating `product` itself as optional can hide the actual contract.

Place the check where the uncertainty really exists.

---

### Strict mode does not guarantee bug-free software

Static typing cannot detect every possible runtime problem, business-rule error, server failure, or incorrect algorithm.

Strict mode is a safety net, not proof that the application is correct.

---

## Interview-Ready Explanation

I would enable TypeScript strict mode because it gives us stronger compile-time protection and helps us get the full benefit of TypeScript. It forces developers to explicitly handle things like missing values, unsafe types, and uninitialized properties instead of allowing those assumptions to pass silently. That lets the compiler catch potential problems during development that might otherwise become JavaScript runtime errors. In a production Angular application, that improves reliability and makes refactoring safer.

---

## Final Takeaway

A useful way to think about strict TypeScript is:

> Make unsafe assumptions explicit before they become runtime problems.

The most important patterns from this lesson are:

```text
Implicit any
→ Define a meaningful type contract.

null / undefined
→ Handle the missing state explicitly.

Optional property
→ Check the property that is actually optional.

Required class property
→ Guarantee initialization.

Strict mode
→ Let the compiler challenge unsafe assumptions.
```

Strict mode is not about making TypeScript unnecessarily difficult.

It is about getting more value from the type system by allowing the compiler to identify places where the code claims to know more than it can actually guarantee.

## Reference

- <a href="https://www.typescriptlang.org/tsconfig/" target="_blank" rel="noopener noreferrer">https://www.typescriptlang.org/tsconfig/</a>
