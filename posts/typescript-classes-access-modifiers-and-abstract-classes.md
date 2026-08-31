---
title: "TypeScript Mastery: Classes, Access Modifiers, and Abstract Classes"
description: "A practical guide to TypeScript classes, access modifiers, abstract classes, interfaces, inheritance, and choosing composition when it better represents the design."
published: true
datePublished: "August 30, 2026"
picture: "assets/posts/buildingblocks.jpg"
tags:
  - typescript
  - classes
  - object-oriented-design
displayOrder: 2
---

# TypeScript Mastery: Classes, Access Modifiers, and Abstract Classes

August 30, 2026

Classes are common in TypeScript and especially familiar to Angular developers. Components and services are typically classes, and TypeScript gives those classes tools for controlling state, exposing behavior, and modeling relationships between objects.

The syntax is only part of the lesson.

The more important design question is:

> When is a class useful, and when would a plain object, function, interface, or composed dependency be simpler?

This lesson covers class fundamentals, access modifiers, `readonly`, inheritance, abstract classes, interfaces, and the design-level distinction between inheritance and composition.

---

## Classes Combine State and Behavior

A class can bundle state together with behavior that operates on that state.

```typescript
class BankAccount {
  balance = 0;

  deposit(amount: number): void {
    this.balance += amount;
  }
}

const account = new BankAccount();
account.deposit(100);

console.log(account.balance); // 100
```

The instance contains state in `balance` and behavior in `deposit()`.

A useful question when considering a class is:

> Do I have related state and behavior that naturally belong together?

Not every TypeScript model needs a class. If an application simply needs to describe data and transform it, a type and function may be clearer:

```typescript
type User = {
  id: number;
  name: string;
};

function getDisplayName(user: User): string {
  return user.name.toUpperCase();
}
```

---

## Access Modifiers

TypeScript provides three important class access modifiers:

```text
public    → class + subclasses + outside code
protected → class + subclasses
private   → declaring class only
```

These modifiers communicate which parts of a class are intended to be exposed and which should remain implementation details.

### `public`

Class members are `public` by default.

```typescript
class UserAccount {
  public username: string;

  constructor(username: string) {
    this.username = username;
  }
}
```

Outside code can access `username` directly. In Angular code, it is common to omit the explicit `public` keyword when the default behavior is intended.

### `private`

A private member can only be accessed from inside the class that declares it.

```typescript
class UserAccount {
  readonly id: number;
  username: string;
  private password: string;

  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
  }

  checkPassword(password: string): boolean {
    return this.password === password;
  }
}
```

Usage:

```typescript
const account = new UserAccount(1, "Chris", "oldPassword");

console.log(account.checkPassword("wrong")); // false
console.log(account.checkPassword("oldPassword")); // true

account.changePassword("newPassword");

console.log(account.checkPassword("newPassword")); // true

// account.password = "hacked"; // Error
```

This demonstrates **encapsulation**. The benefit is not merely hiding a value. The class controls how that state can be changed.

### `readonly`

A readonly property can be initialized but should not later be reassigned.

```typescript
const account = new UserAccount(1, "Chris", "password");

// account.id = 99; // Error
```

`readonly` communicates that the property should remain stable after initialization.

---

## `protected`: Share With Subclasses Without Exposing Publicly

`protected` sits between `public` and `private`.

```typescript
class Vehicle {
  public make: string;
  private vin: string;
  protected currentSpeed: number;

  constructor(make: string, vin: string) {
    this.make = make;
    this.vin = vin;
    this.currentSpeed = 0;
  }

  getVin(): string {
    return this.vin;
  }

  stop(): void {
    this.currentSpeed = 0;
  }
}

class Car extends Vehicle {
  accelerate(): void {
    this.currentSpeed += 10;
  }

  getSpeed(): number {
    return this.currentSpeed;
  }
}
```

Usage:

```typescript
const car = new Car("Toyota", "ABC123");

car.accelerate();
car.accelerate();

console.log(car.getSpeed()); // 20
console.log(car.make); // Toyota
console.log(car.getVin()); // ABC123
```

`Car` can access `currentSpeed` because it is `protected`, but it cannot directly access `vin` because `vin` is `private` to `Vehicle`.

The mental model is:

```text
public    → everyone
protected → declaring class and subclasses
private   → declaring class only
```

---

## Inheritance Models an "Is-A" Relationship

Inheritance allows one class to extend another:

```typescript
class Car extends Vehicle {
  // ...
}
```

Conceptually:

```text
Car IS A Vehicle
```

Inheritance can be useful when the relationship between the types is genuine and the subclasses meaningfully share behavior or state.

Code reuse alone is not enough reason to create an inheritance hierarchy.

---

## Abstract Classes

An abstract class is a base class that cannot be instantiated directly.

It can provide shared state, constructors, concrete methods, and abstract methods that subclasses must implement.

```typescript
abstract class ANotification {
  public recipient: string;

  constructor(recipient: string) {
    this.recipient = recipient;
  }

  log(): void {
    console.log(`Sending notification to ${this.recipient}`);
  }

  abstract send(message: string): void;
}
```

The `log()` method already has an implementation. The `send()` method does not.

The abstract class is saying:

> Every concrete notification must know how to send a message, but each notification type decides how that behavior works.

Subclasses provide the missing behavior:

```typescript
class EmailNotification extends ANotification {
  send(message: string): void {
    console.log(`Emailing "${message}" to ${this.recipient}`);
  }
}

class SmsNotification extends ANotification {
  send(message: string): void {
    console.log(`Texting "${message}" to ${this.recipient}`);
  }
}
```

Usage:

```typescript
const email = new EmailNotification("chris@example.com");
const sms = new SmsNotification("555-1234");

email.log();
email.send("Hello!");

sms.log();
sms.send("Hello!");
```

Both subclasses inherit `log()` but must implement `send()`.

A useful mental model is:

> An abstract class is a partially implemented base class that provides shared state or behavior while requiring subclasses to implement specific behavior themselves.

---

## Interfaces Define Contracts

An interface solves a different problem.

```typescript
interface PaymentProcessor {
  processPayment(amount: number): void;
}
```

This defines a contract:

> Something satisfying `PaymentProcessor` must provide a compatible `processPayment()` method.

Different classes can provide different implementations:

```typescript
class StripePaymentProcessor implements PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing ${amount} with Stripe`);
  }
}

class PayPalPaymentProcessor implements PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing ${amount} with PayPal`);
  }
}
```

The interface describes **what capability must exist**, not how that capability works.

---

## Interface vs. Abstract Class

A useful distinction is:

```text
Interface
→ What contract or capability must this type satisfy?

Abstract class
→ What kind of thing is this, and what shared state or behavior
  do its specialized versions inherit?
```

An abstract class can provide concrete shared behavior:

```typescript
abstract class Shape {
  constructor(
    public x: number,
    public y: number,
  ) {}

  move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  abstract getArea(): number;
}
```

A `Circle` and `Rectangle` can both genuinely be Shapes, share position and movement behavior, and calculate area differently.

A practical guideline is:

> Use an interface when the main need is a contract. Consider an abstract class when there is a genuine inheritance relationship with meaningful shared state or implementation.

---

## Composition Is Different From an Interface

Interfaces and composition often work together, but they are not the same concept.

An interface defines a contract:

```typescript
interface Logger {
  log(message: string): void;
}
```

Composition means one object is built using another object:

```typescript
class UserService {
  constructor(private logger: Logger) {}

  saveUser(): void {
    // Save user...
    this.logger.log("User saved");
  }
}
```

The relationship is:

```text
UserService USES A Logger
```

The interface describes what kind of logger `UserService` needs. Composition supplies that dependency.

---

## "Is-A" vs. "Uses-A"

This is one of the most useful design questions when choosing between inheritance and composition.

Inheritance:

```text
Car IS A Vehicle
Circle IS A Shape
Rectangle IS A Shape
```

Composition:

```text
UserService USES A Logger
CheckoutService USES A PaymentProcessor
Angular service USES HttpClient
```

For example:

```typescript
class CheckoutService {
  constructor(private paymentProcessor: PaymentProcessor) {}

  checkout(amount: number): void {
    this.paymentProcessor.processPayment(amount);
  }
}
```

It would make little conceptual sense to say:

```text
CheckoutService IS A PaymentProcessor
```

Instead:

```text
CheckoutService USES A PaymentProcessor
```

That is composition.

---

## Favor Composition Over Inheritance

A common design guideline is:

> Favor composition over inheritance.

This does not mean inheritance is always wrong. It means inheritance creates a tighter relationship between types and should represent a meaningful relationship rather than simply being a convenient way to reuse code.

Consider three unrelated services that all need logging:

```text
UserService
OrderService
ProductService
```

Making all three extend `BaseLoggingService` would reuse code, but it creates a questionable relationship. A `UserService` is not a kind of logging service.

Composition expresses the relationship more accurately:

```typescript
interface Logger {
  log(message: string): void;
}

class UserService {
  constructor(private logger: Logger) {}
}

class OrderService {
  constructor(private logger: Logger) {}
}

class ProductService {
  constructor(private logger: Logger) {}
}
```

Each service **uses** logging.

This design also makes implementations easier to substitute.

---

## Composition and Testability

An interface plus composition makes it easy to provide different implementations:

```typescript
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class RemoteLogger implements Logger {
  log(message: string): void {
    // Send the message to a remote logging system.
  }
}

class FakeLogger implements Logger {
  log(message: string): void {
    // Test-specific behavior.
  }
}
```

The consuming service only needs the contract:

```typescript
class UserService {
  constructor(private logger: Logger) {}
}
```

It does not need to know which implementation it received. It only needs something satisfying the required capability.

---

## Why This Matters in Angular

Composition is everywhere in Angular.

Consider a service using `HttpClient`:

```typescript
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}
}
```

A `UserService` is not an `HttpClient`.

It **uses** an `HttpClient`.

That is composition.

Dependency injection makes this pattern especially important because Angular classes frequently receive the capabilities they need instead of inheriting from unrelated base classes.

---

## Choosing the Simplest Design

A useful decision process is:

### Do I simply need to describe data?

Use a type or interface.

```typescript
type User = {
  id: number;
  firstName: string;
  lastName: string;
};
```

### Do I simply need to transform data?

Use a function.

```typescript
function getFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
```

### Do I need to define a capability?

Consider an interface.

```typescript
interface PaymentProcessor {
  processPayment(amount: number): void;
}
```

### Does one object need to use another capability?

Consider composition.

```typescript
class CheckoutService {
  constructor(private processor: PaymentProcessor) {}
}
```

### Are these specialized versions of the same concept with meaningful shared state or behavior?

An abstract class may make sense.

```text
Circle IS A Shape
Rectangle IS A Shape
```

The goal is not to use the most object-oriented design possible. The goal is to choose the simplest design that accurately represents the relationships in the application.

---

## Common Things to Pay Attention To

### `private` and `protected` are not interchangeable

`private` restricts access to the declaring class.

`protected` allows subclasses to access the member too.

Use `protected` only when subclass access is intentionally part of the design.

### Classes are not required for data models

This is often enough:

```typescript
type ApiUser = {
  id: number;
  name: string;
};
```

A class adds value when state, behavior, initialization, encapsulation, identity, or inheritance actually matter.

### Interfaces and composition are different concepts

An interface defines a contract. Composition describes an object using another object.

They frequently appear together, but they describe different design ideas.

### Do not inherit merely to reuse a method

Ask:

```text
Is this genuinely an "is-a" relationship?

Or does this class simply "use" that capability?
```

That question often points toward the cleaner design.

---

## Interview-Ready Explanation

An interface defines a contract or capability that another type needs to satisfy without providing the implementation. For example, a `PaymentProcessor` interface can require a `processPayment()` method while Stripe and PayPal classes provide different implementations. An abstract class is useful when related classes share common state or implementation but also need to provide some behavior themselves. For example, a `Vehicle` abstract class could contain shared vehicle state and behavior while defining an abstract `move()` method that each specific vehicle implements differently. I would generally use an interface when I mainly need a contract and an abstract class when I have a genuine "is-a" relationship with meaningful shared implementation or state.

---

## Final Takeaway

Keep these mental models nearby:

```text
PLAIN TYPE / FUNCTION
→ What data do I have, or what transformation do I need?

INTERFACE
→ What capability or contract must something satisfy?

COMPOSITION
→ What other capability or object does this thing use?

ABSTRACT CLASS
→ What is this thing, and what meaningful state or behavior
  do all specialized versions share?
```

Access modifiers communicate ownership:

```text
public    → class + subclasses + outside code
protected → class + subclasses
private   → declaring class only
```

And when deciding between inheritance and composition:

```text
IS-A   → inheritance may make sense
USES-A → composition is usually the better starting point
```

The deeper lesson is:

> Do not create a class hierarchy simply because TypeScript allows one. Model genuine relationships, prefer simple data and functions when they are enough, and use composition when an object merely needs another capability.
