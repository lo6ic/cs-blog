---
title: "TypeScript Basics: Interfaces vs Type Aliases"
description: "A practical TypeScript teaching article focused on when to use interfaces, when to use type aliases, and how to choose based on readability, object contracts, unions, and Angular-style state modeling."
published: true
datePublished: "July 25, 2026"
displayOrder: 1
picture: "assets/posts/super.jpg"
---

### TypeScript Basics: Interfaces vs Type Aliases

July 25, 2026

One of the most common TypeScript questions is:

> Should this be an `interface` or a `type`?

That question comes up often because both tools can describe object shapes.

For simple models, they can look almost identical. That can make the choice feel more complicated than it really is.

The goal is not to memorize a strict rule like “always use interfaces” or “always use types.” The better goal is to understand what each tool communicates and choose the one that makes the code easiest to understand.

This lesson focuses on a practical way to think about the difference:

- use either one for simple object shapes
- reach for `interface` when modeling clear object contracts
- reach for `type` when modeling unions, literal values, tuples, or frontend state shapes
- follow the team convention when a codebase already has one

That kind of decision-making matters in Angular because Angular applications rely heavily on typed models, component inputs, service responses, and UI state.

---

#### The Basic Mental Model

Both `interface` and `type` can describe the shape of an object.

Here is an object model written as an interface:

```typescript
interface UserInterface {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "member";
}
```

Here is the same model written as a type alias:

```typescript
type UserType = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "member";
};
```

Both versions describe the same kind of value:

```typescript
const user: UserType = {
  id: 1,
  name: "Chris",
  email: "chris@example.com",
  role: "admin",
};
```

This is why the `interface` vs `type` conversation can be confusing at first.

For simple object models, either form is usually fine.

A highlight I want to bring up is that the question should not be:

> Which one is always better?

The better question is:

> What kind of type am I trying to model?

That shift helps avoid cargo-cult rules.

---

#### Modeling a User Both Ways

Here is a user model to learn from:

```typescript
interface UserInterface {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "member";
}

type UserType = {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "member";
};
```

Both versions are readable.

The `readonly id` communicates that the ID should not be reassigned after the user is created.

The `role` field uses a string literal union:

```typescript
role: "admin" | "member";
```

That means `role` cannot be any random string. It must be either `"admin"` or `"member"`.

This is one of the first places where TypeScript makes a model safer.

Instead of allowing this:

```typescript
role: "owner";
```

TypeScript can limit the field to known valid values.

Sometimes people miss that a union like `"admin" | "member"` is not just documentation. It is an actual compile-time constraint. The editor and compiler can warn when an invalid role is used.

---

#### Modeling a Budget Item Both Ways

Here is another simple object model:

```typescript
interface BudgetItemInterface {
  readonly id: number;
  label: string;
  amount: number;
  category: string;
  isRecurring: boolean;
}
```

The same model can be written as a type alias:

```typescript
type BudgetItemType = {
  readonly id: number;
  label: string;
  amount: number;
  category: string;
  isRecurring: boolean;
};
```

Again, both versions are fine.

This is the important teaching point: for plain object models, the choice is often about readability and team consistency.

If a team prefers interfaces for object models, this is a good interface.

If a team prefers type aliases everywhere, this is also a valid type alias.

The code should communicate the shape clearly.

A highlight I want to bring up is that consistency matters. In a real Angular codebase, switching randomly between `interface` and `type` without a reason can make the project feel harder to read.

---

#### Where Type Aliases Become Especially Useful

Type aliases can describe more than object shapes.

For example, a task status is a great use case for `type`:

```typescript
type TaskStatus = "todo" | "in-progress" | "done";
```

This is not an object. It is a union of allowed string values.

That makes `type` the right tool.

Now the task model can use that union:

```typescript
interface TaskInterface {
  readonly id: number;
  title: string;
  status: TaskStatus;
  assignedTo?: string;
}
```

Or the same task can be written as a type alias:

```typescript
type TaskType = {
  readonly id: number;
  title: string;
  status: TaskStatus;
  assignedTo?: string;
};
```

This combination is common:

```typescript
type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  readonly id: number;
  title: string;
  status: TaskStatus;
}
```

The `type` handles the union. The `interface` handles the object contract.

That is a practical pattern to remember.

Sometimes people try to force everything into one tool. But TypeScript gives both tools because different modeling problems need different shapes.

---

#### Testing the Task Status

Here is an invalid task:

```typescript
const badTask: TaskType = {
  id: 1,
  title: "Fix login",
  status: "blocked",
};
```

This should fail because `"blocked"` is not part of `TaskStatus`.

The allowed values are only:

```typescript
type TaskStatus = "todo" | "in-progress" | "done";
```

This is a small example, but it connects directly to Angular work.

Frontend applications constantly deal with status fields:

- loading
- success
- error
- disabled
- active
- archived
- pending
- complete

Using literal unions can make those values much safer than plain strings.

---

#### Extending Interfaces

Interfaces can extend other interfaces.

Here is a base entity:

```typescript
interface BaseEntityInterface {
  readonly id: number;
  createdAt: string;
}
```

Now a project interface can extend it:

```typescript
interface ProjectInterface extends BaseEntityInterface {
  name: string;
  status: "active" | "archived";
}
```

This reads naturally.

The `extends` keyword communicates that `ProjectInterface` builds on top of `BaseEntityInterface`.

A second interface can extend the project again:

```typescript
interface ProjectInterface2 extends ProjectInterface {
  foo: string;
}
```

This is one reason interfaces can feel clearer when modeling object relationships.

A highlight I want to bring up is that `extends` often reads like plain English. When someone sees it, they can usually understand that one object contract is building from another.

---

#### Composing Types with Intersections

Type aliases can compose object shapes using intersections.

Here is the same idea with types:

```typescript
type BaseEntityType = {
  readonly id: number;
  createdAt: string;
};

type ProjectType = BaseEntityType & {
  name: string;
  status: "active" | "archived";
};
```

The `&` means intersection.

A useful way to read it is:

> `ProjectType` has everything from `BaseEntityType` plus these additional fields.

Another type can build on top of it:

```typescript
type ProjectType2 = ProjectType & {
  foo: string;
};
```

This is valid TypeScript.

However, sometimes the `&` symbol is less immediately readable than the `extends` keyword.

That does not make it wrong. It just means readability should be considered.

For object inheritance-style modeling, some developers prefer interfaces because `extends` makes the intent obvious. For more advanced composition or union-based state, type aliases often become more expressive.

---

#### Interface Extension vs Type Intersection

Here are both approaches side by side:

```typescript
interface ProjectInterface extends BaseEntityInterface {
  name: string;
  status: "active" | "archived";
}
```

```typescript
type ProjectType = BaseEntityType & {
  name: string;
  status: "active" | "archived";
};
```

Both can work.

The interface version reads like:

> Project extends base entity.

The type version reads like:

> Project is base entity combined with these fields.

A highlight I want to bring up is that one is not automatically more professional than the other. A strong TypeScript developer can explain why they chose one.

That explanation matters more than copying a rule from another codebase.

---

#### Angular-Style State Unions

One of the best uses for `type` in Angular-style frontend work is UI state.

Here is a state model to learn from:

```typescript
type UserLoadState = { status: "idle" } | { status: "loading" } | { status: "success"; user: UserType } | { status: "error"; message: string };
```

This type says the state can be one of four shapes.

An idle state has only a status:

```typescript
const idleState: UserLoadState = {
  status: "idle",
};
```

A loading state has only a status:

```typescript
const loadingState: UserLoadState = {
  status: "loading",
};
```

A success state must include a user:

```typescript
const successState: UserLoadState = {
  status: "success",
  user: {
    id: 22,
    name: "Jack",
    email: "jack@example.com",
    role: "member",
  },
};
```

An error state must include a message:

```typescript
const errorState: UserLoadState = {
  status: "error",
  message: "404",
};
```

This is a very useful frontend pattern.

Sometimes people model this kind of state with loose optional properties:

```typescript
type LooseUserState = {
  loading?: boolean;
  user?: UserType;
  error?: string;
};
```

That can work, but it can also allow confusing combinations:

```typescript
const confusingState: LooseUserState = {
  loading: true,
  user: {
    id: 1,
    name: "Maya",
    email: "maya@example.com",
    role: "member",
  },
  error: "Something failed",
};
```

Is the app loading? Did it succeed? Did it fail?

The union version is clearer because each state describes exactly which data belongs with it.

That is why `type` is so useful for Angular-style loading, success, and error flows.

---

#### Iterating Through State Examples

A simple state list might look like this:

```typescript
const stateArray: UserLoadState[] = [idleState, loadingState, successState, errorState];

for (const state of stateArray) {
  console.log(state);
}
```

This is also a good place to remember the `for...of` lesson.

Use `for...of` when you want the actual item from the array.

```typescript
for (const state of stateArray) {
  console.log(state);
}
```

Use `for...in` when you want keys or indexes.

For arrays of objects, `for...of` is usually the clearer choice.

---

#### A Practical Rule for Angular Apps

A practical pattern is:

```typescript
interface User {
  readonly id: number;
  name: string;
  email: string;
}
```

```typescript
type UserLoadState = { status: "loading" } | { status: "success"; user: User } | { status: "error"; message: string };
```

This gives the app:

1. a clear object contract for the user
2. a safe union type for the UI state

That is a strong combination.

In Angular, this might show up in:

- API response models
- component input models
- view models
- service return types
- state objects
- form modes
- button variants
- loading/error state

A highlight I want to bring up is that TypeScript is not just about preventing wrong values. It is also about making code easier to read and easier to refactor.

When the shape of a value is clear, the rest of the app becomes easier to reason about.

---

#### Common Things to Pay Attention To

#### 1. Sometimes people look for an absolute rule

It is tempting to ask:

> Should I always use interfaces?

or:

> Should I always use type aliases?

For simple object shapes, either one can work.

A team may choose one for consistency, and that is okay. But the better understanding is knowing what each tool is good at.

---

#### 2. Sometimes people forget that `type` can model unions

This is one of the most important reasons to use type aliases.

```typescript
type ButtonVariant = "primary" | "secondary" | "danger";
```

```typescript
type ApiState = { status: "loading" } | { status: "success"; data: string[] } | { status: "error"; message: string };
```

Interfaces cannot directly model these union shapes.

---

#### 3. Sometimes people use loose optional state when a union would be safer

This is common in frontend code.

Loose state can accidentally allow impossible combinations.

A union state describes the allowed states more clearly.

That makes it easier for the component, template, and developer to know what data is available.

---

#### 4. A highlight I want to bring up is readability

The interface version of extension:

```typescript
interface ProjectInterface extends BaseEntityInterface {
  name: string;
  status: "active" | "archived";
}
```

may read more clearly than:

```typescript
type ProjectType = BaseEntityType & {
  name: string;
  status: "active" | "archived";
};
```

Both are valid. But if `extends` communicates the intent better, that is a reasonable reason to use an interface.

---

#### Why This Matters in Angular

Angular codebases depend heavily on clear contracts.

A component wants to know what kind of input it receives.

A service wants to know what shape an API response has.

A template wants to know which fields are safe to display.

A state object should clearly express whether the app is loading, successful, or in an error state.

That is where `interface` and `type` both help.

An interface can describe a model:

```typescript
interface UserCardViewModel {
  readonly id: number;
  displayName: string;
  email: string;
}
```

A type alias can describe a state union:

```typescript
type UserCardState = { status: "loading" } | { status: "success"; user: UserCardViewModel } | { status: "error"; message: string };
```

Together, these tools make Angular code easier to understand, safer to change, and easier to explain in an interview.

---

#### Interview-Ready Explanation

A strong explanation might sound like this:

> In an Angular app, either `interface` or `type` can work for simple object models because both can describe object shapes clearly. I usually lean toward `interface` when defining object contracts like API models, component view models, or shapes that may be extended with `extends`. I reach for `type` when I need unions, literal statuses, tuples, or UI state shapes like loading, success, and error. For example, a `User` model could be an interface, but a `UserLoadState` union should be a type alias. I would also follow the team’s existing convention because consistency across a codebase matters more than forcing one style everywhere.

---

#### Final Takeaway

The main takeaway is that `interface` and `type` overlap, but they are not identical tools.

For object contracts, interfaces often read naturally.

For unions, literal values, tuples, and state shapes, type aliases are usually the better fit.

A practical Angular pattern is:

```typescript
interface User {
  readonly id: number;
  name: string;
  email: string;
}

type UserLoadState = { status: "loading" } | { status: "success"; user: User } | { status: "error"; message: string };
```

That pattern keeps object models clear and state modeling safe.

The goal is not to win an argument about which tool is better.

The goal is to choose the type form that makes the code easier to understand, safer to maintain, and clearer for the next developer reading it.
