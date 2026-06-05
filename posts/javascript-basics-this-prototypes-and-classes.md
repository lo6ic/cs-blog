---
title: "JavaScript Basics: this, Prototypes, and Class Mental Models"
description: "A practical refresher on JavaScript this, prototype lookup, shared methods, and how class syntax works under the hood."
published: true
datePublished: "June 4, 2026"
picture: "assets/posts/two.jpg"
---

## JavaScript Basics: this, Prototypes, and Class Mental Models

June 4, 2026

In today’s article, I want to focus on three foundational JavaScript ideas:

1. How `this` is determined by the caller
2. How prototypes share behavior across object instances
3. How modern class syntax connects back to JavaScript’s prototype system

These ideas can feel confusing because JavaScript looks like it has “classes” in the traditional object-oriented sense, but under the hood it still relies heavily on prototypes. Understanding this makes Angular, TypeScript, callbacks, services, and component classes feel much less magical.

---

### JavaScript Values

When thinking about JavaScript objects, methods, and classes, it helps to separate two ideas:

- **data that belongs to an object**
- **behavior that can be shared through a prototype**

A simple mental model is:

> Objects store data, prototypes share behavior, and `this` depends on the caller.

That sentence became the main takeaway from this lesson.

An object instance usually stores its own values, like a `name`, `brand`, or `id`. Methods, especially methods created with class syntax, usually live on the prototype so they can be shared across instances instead of copied onto every object.

---

### JavaScript Primitives

The focus today was not primitives directly, but this lesson builds on the same JavaScript foundation: variables, values, references, objects, and functions all affect how code behaves at runtime.

The key concept today was that functions are values too.

That means a method can be copied from one object to another, detached from its original object, or passed as a callback. When that happens, `this` may not be what I first expect.

This is where I got tripped up at first:

```javascript
const user = {
  name: "Chris",

  greet() {
    return this.name;
  },
};

const admin = {
  name: "Morgan",
  greet: user.greet,
};

console.log(admin.greet());
```

At first, it is tempting to think this prints `"Chris"` because the `greet` function originally came from `user`.

But the correct output is:

```javascript
"Morgan";
```

Why?

Because `this` is determined by **how the function is called**, not where the function was originally written.

The call is:

```javascript
admin.greet();
```

So the caller is `admin`, and `this.name` becomes `admin.name`.

---

### Primitive Example

A useful starting point is the simplest `this` example:

```javascript
const user = {
  name: "Sam",

  greet() {
    return this.name;
  },
};

console.log(user.greet());
```

This prints:

```javascript
"Sam";
```

Why?

Because the function is called as a method:

```javascript
user.greet();
```

The object before the dot becomes the value of `this`.

So in this call:

```javascript
this === user;
```

That means:

```javascript
this.name;
```

is the same as:

```javascript
user.name;
```

This is the clean version where everything behaves as expected.

---

### Object Reference Example

The part that threw me for a loop was what happens when a method is detached from the object.

```javascript
const user = {
  name: "Sam",

  greet() {
    return this.name;
  },
};

const fn = user.greet;

console.log(fn());
```

The output is:

```javascript
undefined;
```

At first, this can feel strange because `fn` came from `user.greet`.

But JavaScript does not care where the function came from. It cares how the function is called.

Here the call is:

```javascript
fn();
```

There is no object before the dot. The function has been detached from `user`, so `this` is no longer `user`.

A better explanation is:

> `this` depends on the caller. Since `fn()` is called as a plain function, it loses the original object context.

This also explains why callback bugs happen in Angular and JavaScript.

For example:

```typescript
setTimeout(this.loadData, 1000);
```

This can lose the component context because `loadData` is passed as a function reference.

A safer version is:

```typescript
setTimeout(() => this.loadData(), 1000);
```

The arrow function preserves the surrounding `this` and calls the method from the correct component instance.

---

### Why Mutation Causes Bugs

In this lesson, the equivalent “bug generator” was not mutation. It was **incorrect assumptions about method context**.

A context bug happens when a method relies on `this`, but the function is called without the object that should own that method.

For example:

```javascript
const user = {
  name: "Taylor",

  sayName() {
    console.log(this.name);
  },
};

const fn = user.sayName;

fn();
```

This logs:

```javascript
undefined;
```

The bug is not that the method disappeared. The method still exists. The issue is that the method lost its caller.

This matters because frontend code passes functions around all the time:

- event handlers
- callbacks
- RxJS subscriptions
- timers
- component methods
- service methods
- array methods

The important rule is:

> `this` follows the call site, not the original object.

---

### Coding Examples

Save this into a `.js` file and inspect the console output:

```javascript
console.log("--- THIS WITH METHOD CALLS ---");

const user = {
  name: "Sam",

  greet() {
    return this.name;
  },
};

console.log(user.greet()); // "Sam"

console.log("\n--- DETACHED METHOD ---");

const fn = user.greet;
console.log(fn()); // undefined in this mental model

console.log("\n--- SAME FUNCTION, DIFFERENT CALLER ---");

const admin = {
  name: "Morgan",
  greet: user.greet,
};

console.log(admin.greet()); // "Morgan"

console.log("\n--- PROTOTYPE-BASED EXAMPLE ---");

function Vehicle(brand) {
  this.brand = brand;
}

Vehicle.prototype.drive = function () {
  return `${this.brand} is driving`;
};

const car1 = new Vehicle("Toyota");
const car2 = new Vehicle("Honda");

console.log(car1.drive()); // "Toyota is driving"
console.log(car2.drive()); // "Honda is driving"
console.log(car1.drive === car2.drive); // true

console.log("\n--- CLASS-BASED EXAMPLE ---");

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

const dog = new Animal("Buddy");
const cat = new Animal("Milo");

console.log(dog.speak()); // "Buddy makes a sound"
console.log(cat.speak()); // "Milo makes a sound"
console.log(dog.speak === cat.speak); // true

console.log("\n--- EXTENDS AND PROTOTYPE LOOKUP ---");

class BaseAnimal {
  speak() {
    return "sound";
  }
}

class Dog extends BaseAnimal {}

const myDog = new Dog();

console.log(myDog.speak()); // "sound"
```

---

### Highlights to Pay Attention To

#### 1. `this` depends on the caller

This was the biggest correction from today.

The wrong mental model is:

> `this` means where the function was written.

The better mental model is:

> `this` depends on how the function is called.

So this call:

```javascript
user.greet();
```

means `this` is `user`.

But this call:

```javascript
fn();
```

does not have `user` as the caller.

#### 2. Methods can be shared through prototypes

With constructor functions, methods can be placed on the prototype:

```javascript
function Vehicle(brand) {
  this.brand = brand;
}

Vehicle.prototype.drive = function () {
  return `${this.brand} is driving`;
};
```

This means every `Vehicle` instance can use `drive`, but the function is not copied onto every object.

That is why this returns `true`:

```javascript
const car1 = new Vehicle("Toyota");
const car2 = new Vehicle("Honda");

console.log(car1.drive === car2.drive); // true
```

Both objects share the same method from `Vehicle.prototype`.

#### 3. Class methods also live on the prototype

Modern JavaScript class syntax looks cleaner:

```javascript
class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }

  drive() {
    return `${this.brand} is driving`;
  }
}
```

But under the hood, the method still lives on:

```javascript
Vehicle.prototype.drive;
```

That means class syntax is mostly a cleaner way to work with JavaScript’s existing prototype system.

A strong interview sentence is:

> Classes are syntax developers write. Prototypes are what JavaScript uses under the hood to share behavior.

#### 4. The prototype chain is lookup behavior

The prototype chain is how JavaScript searches for a property or method.

If JavaScript cannot find a method directly on an object, it checks the object’s prototype, then that prototype’s prototype, and keeps going until it reaches `Object.prototype` and then `null`.

For example:

```javascript
class Animal {
  speak() {
    return "sound";
  }
}

class Dog extends Animal {}

const dog = new Dog();

console.log(dog.speak());
```

The output is:

```javascript
"sound";
```

JavaScript looks for `speak` like this:

```text
dog
  -> Dog.prototype
  -> Animal.prototype
  -> Object.prototype
  -> null
```

It finds `speak` on `Animal.prototype`.

---

### Safer Nested Copy Example

For this topic, the safer pattern is not a nested copy. The safer pattern is preserving `this` intentionally when passing methods around.

Problem version:

```typescript
@Component({})
export class UserComponent {
  username = "Chris";

  logUser() {
    console.log(this.username);
  }

  ngOnInit() {
    setTimeout(this.logUser, 1000);
  }
}
```

The method can lose its component context because it is passed as a detached function.

Safer version:

```typescript
@Component({})
export class UserComponent {
  username = "Chris";

  logUser() {
    console.log(this.username);
  }

  ngOnInit() {
    setTimeout(() => this.logUser(), 1000);
  }
}
```

Another option is:

```typescript
setTimeout(this.logUser.bind(this), 1000);
```

But in Angular code, the arrow function version is often clearer.

The lesson is:

> When a method uses `this`, be careful passing it around as a plain function.

---

### Common Beginner Mistakes to Avoid

#### 1. Thinking `this` is based on where the function was written

This was the main thing that threw me off.

In this example:

```javascript
const user = {
  name: "Chris",

  greet() {
    return this.name;
  },
};

const admin = {
  name: "Morgan",
  greet: user.greet,
};

admin.greet();
```

The result is `"Morgan"`, not `"Chris"`.

The function came from `user`, but it was called by `admin`.

#### 2. Thinking class methods are copied to every instance

They are not.

Class methods are shared through the prototype.

```javascript
class User {
  greet() {
    return "hi";
  }
}

const u1 = new User();
const u2 = new User();

console.log(u1.greet === u2.greet); // true
```

This matters because prototypes are JavaScript’s sharing mechanism.

#### 3. Thinking the prototype chain is just a list to memorize

The prototype chain is not just trivia.

It is the lookup path JavaScript uses when trying to find properties and methods.

A plain-English explanation is:

> If an object does not have something, JavaScript asks its prototype. If that prototype does not have it, JavaScript keeps asking up the chain until it finds it or reaches `null`.

---

### Why This Matters in Angular

This topic matters a lot in Angular development because Angular uses classes everywhere.

For example:

```typescript
@Injectable({
  providedIn: "root",
})
export class UserService {
  getUser() {
    return "Chris";
  }
}
```

And:

```typescript
@Component({})
export class DashboardComponent {
  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log(this.userService.getUser());
  }
}
```

A helpful mental model is that Angular is doing something conceptually like this:

```typescript
const service = new UserService();
const component = new DashboardComponent(service);
```

Angular dependency injection creates and provides class instances for us.

So Angular is not magic. It is built on top of JavaScript and TypeScript fundamentals:

- classes
- objects
- methods
- prototypes
- function calls
- dependency injection
- reactive streams

Understanding `this` also helps prevent Angular callback bugs, especially when passing class methods into functions, timers, event handlers, or RxJS pipelines.

---

### Final Takeaway

The biggest lesson for me from this refresher is this:

> Objects store data, prototypes share behavior, and `this` depends on the caller.

Today I started with a decent understanding of classes and objects, but I got tripped up by one key detail: I thought a method might keep the `this` value from the object where it was originally written.

The correction was:

> `this` is not about where a function came from. It is about how the function is called.

That helped make the rest of the lesson click.

The prototype chain also became clearer:

> If JavaScript cannot find a property or method on an object, it checks the object’s prototype, then keeps checking up the chain until it finds the value or reaches `null`.

Understanding this makes JavaScript feel less mysterious and makes Angular classes, services, callbacks, and dependency injection easier to reason about.
