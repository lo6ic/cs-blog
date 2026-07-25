---
title: "TypeScript Mastery: Unions, Narrowing, and Discriminated Unions"
description: "A practical teaching article on using TypeScript unions, narrowing, and discriminated unions to model safer frontend request state."
published: true
datePublished: "July 25, 2026"
displayOrder: 2
picture: "assets/posts/two.jpg"
---

### TypeScript Mastery: Unions, Narrowing, and Discriminated Unions

July 25, 2026

When learning TypeScript for frontend development, one of the most useful patterns to understand is the discriminated union.

This topic matters because frontend applications spend a lot of time moving between different UI states:

1. nothing has happened yet
2. data is loading
3. data loaded successfully
4. no data was found
5. something failed

A common beginner approach is to model that with several loose properties like `loading`, `data`, and `error`. That can work at first, but it also makes it easy to create confusing state combinations.

A discriminated union gives each state its own clear shape.

Instead of asking, “Which optional properties happen to exist right now?”, the code can ask, “Which state am I in?” Then TypeScript can narrow the type and help protect each branch.

---

#### The Big Idea

A union type means a value can be one of several allowed forms.

For example:

```typescript
type UserId = number | string;
```

That means a `UserId` can be either a number or a string.

Literal unions take that idea further:

```typescript
type ButtonVariant = "primary" | "secondary" | "danger";
```

Now the value cannot be just any string. It has to be one of those three exact values.

This is helpful because frontend code often has a fixed set of valid options:

- button variants
- loading statuses
- form modes
- task statuses
- API request states
- route modes
- UI display states

A plain `string` is too open-ended for many of those cases.

```typescript
let status: string = "banana";
```

That is technically valid if `status` is only typed as `string`, but it probably does not make sense for a request state.

A literal union gives TypeScript a smaller, safer vocabulary to work with.

---

#### Teaching Example: Basic Type Narrowing

Here is a small function to learn from:

```typescript
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return value.toFixed(2);
}
```

At the start of the function, TypeScript knows this:

```typescript
value: string | number;
```

That means `value` might be a string or it might be a number.

Inside this branch:

```typescript
if (typeof value === "string") {
  return value.toUpperCase();
}
```

TypeScript narrows `value` to a string. That is why `toUpperCase()` is safe.

After that branch returns, TypeScript can reason that the remaining path must be the number case. That is why this works:

```typescript
return value.toFixed(2);
```

A highlight I want to bring up is that narrowing is not magic. It comes from checks in the code. TypeScript watches those checks and uses them to understand which type is safe in each branch.

---

#### Teaching Example: Button Variants

Literal unions are useful for values with a limited list of options.

```typescript
type ButtonVariant = "primary" | "secondary" | "danger";

function getButtonClass(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "btn-primary";
    case "secondary":
      return "btn-secondary";
    case "danger":
      return "btn-danger";
  }
}
```

This function accepts only valid button variants.

These calls are allowed:

```typescript
getButtonClass("primary");
getButtonClass("secondary");
getButtonClass("danger");
```

This call should fail:

```typescript
getButtonClass("warning");
```

`"warning"` is not part of the `ButtonVariant` union.

Sometimes people miss this idea: a literal union is not just documentation. It actually changes what TypeScript allows. It helps stop invalid values before they spread through the app.

---

#### Why Loose Frontend State Can Become Confusing

A common way to model request state is with optional properties:

```typescript
type LooseRequestState<T> = {
  loading: boolean;
  data?: T;
  error?: string;
};
```

At first, this looks reasonable.

But it allows state combinations that do not make much sense:

```typescript
const badState: LooseRequestState<string[]> = {
  loading: true,
  data: ["Angular", "TypeScript"],
  error: "Request failed",
};
```

This state says three things at once:

1. the request is loading
2. data already exists
3. an error also exists

That is confusing for the UI.

Should the screen show a spinner? Should it show the data? Should it show an error message?

The type does not make the answer clear.

This is where discriminated unions become very helpful.

---

#### Teaching Example: RequestState

A better request state model gives each possible state its own shape:

```typescript
type RequestState<T> = { status: "idle" } | { status: "loading" } | { status: "success"; data: T } | { status: "error"; message: string } | { status: "empty" };
```

This is a discriminated union.

The shared discriminant property is:

```typescript
status;
```

Each branch has a different literal value:

```typescript
"idle";
"loading";
"success";
"error";
"empty";
```

That shared `status` field tells TypeScript which shape the object has.

If the status is `"success"`, the object must have `data`.

If the status is `"error"`, the object must have `message`.

If the status is `"loading"`, the object does not need `data` or `message`.

This is much safer than a loose object with optional properties.

---

#### Modeling a User Request

First, define the data shape:

```typescript
type User = {
  readonly id: number;
  name: string;
  email: string;
};
```

Then use the generic request state:

```typescript
const idleState: RequestState<User> = {
  status: "idle",
};

const loadingState: RequestState<User> = {
  status: "loading",
};

const successState: RequestState<User> = {
  status: "success",
  data: {
    id: 1,
    name: "chris",
    email: "chris@test.com",
  },
};

const errorState: RequestState<User> = {
  status: "error",
  message: "404 No User",
};

const emptyState: RequestState<User> = {
  status: "empty",
};
```

This is a strong frontend pattern.

Each state has exactly the data it needs.

A success state has a user. An error state has a message. An empty state does not pretend to have user data.

---

#### Rendering Different State Branches

The most important part of this lesson is rendering based on the discriminant.

```typescript
function renderUserState(state: RequestState<User>): string {
  switch (state.status) {
    case "idle":
      return "No user requested yet.";

    case "loading":
      return "Loading user...";

    case "success":
      return `User: ${state.data.name} - ${state.data.email}`;

    case "error":
      return `Error: ${state.message}`;

    case "empty":
      return "No data found.";

    default:
      return assertNever(state);
  }
}
```

Inside the `"success"` case, TypeScript knows `state` is the success version of the union.

That is why this is safe:

```typescript
state.data.name;
```

Inside the `"error"` case, TypeScript knows `state` is the error version of the union.

That is why this is safe:

```typescript
state.message;
```

A highlight I want to bring up is that `state.data` should not be accessed before checking the status. Not every branch has `data`. The status check is what makes the access safe.

---

#### The `assertNever` Pattern

Here is the helper function:

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
```

This is used in the `default` branch of the switch:

```typescript
default:
  return assertNever(state);
```

The goal is exhaustiveness.

In plain English, the code is saying:

> If every valid state has already been handled, there should be nothing left here.

If a new state is added later, TypeScript can help catch places where the render function was not updated.

For example, imagine adding this:

```typescript
| { status: "refreshing"; data: T }
```

If the switch does not handle `"refreshing"`, the `assertNever` pattern can help reveal the missing branch.

Sometimes people miss how valuable this is in frontend work. UI state grows over time. A component might start with loading, success, and error. Later it may need empty, refreshing, unauthorized, or offline. Exhaustiveness checking helps prevent silent missing cases.

---

#### What to Pay Attention To

#### 1. Sometimes people access branch-specific data too early

This is the mistake to avoid:

```typescript
function renderState(state: RequestState<User>): string {
  return state.data.name;
}
```

That should not be safe because not every state has `data`.

Only the success branch has data.

The safer pattern is:

```typescript
if (state.status === "success") {
  return state.data.name;
}
```

or:

```typescript
switch (state.status) {
  case "success":
    return state.data.name;
}
```

The discriminant check is what gives TypeScript enough information.

---

#### 2. Sometimes people use one loose object for every state

This style is common:

```typescript
type RequestState<T> = {
  loading?: boolean;
  data?: T;
  error?: string;
};
```

The problem is that too many combinations are possible.

A state can accidentally have loading, data, and error at the same time.

A discriminated union is stricter:

```typescript
type RequestState<T> = { status: "loading" } | { status: "success"; data: T } | { status: "error"; message: string };
```

Each branch says exactly what is allowed.

---

#### 3. Sometimes people forget the shared discriminant

A discriminated union needs a shared property.

This works well:

```typescript
type State = { status: "loading" } | { status: "success"; data: string[] } | { status: "error"; message: string };
```

The shared field is `status`.

Without a shared field, TypeScript may still narrow in some situations, but the state model is usually harder to reason about.

For UI state, using a clear shared property like `status` or `kind` is usually better.

---

#### 4. A highlight I want to bring up is naming

The shared property should be boring and obvious.

Good options:

```typescript
status;
kind;
type;
state;
```

For request state, `status` is usually easy to understand.

```typescript
state.status;
```

reads naturally in a render function.

---

#### 5. Sometimes people think `never` is only theoretical

`never` can feel abstract at first.

But in this pattern, it has a practical purpose.

It helps TypeScript say:

> There should be no possible state left here.

That is useful when adding new UI states over time.

---

#### Why This Matters in Angular

Angular components often render different UI branches.

A component may need to show:

- a loading spinner
- a success view
- an empty state
- an error alert
- a retry button

Without a strong state model, the component can become full of unclear checks.

A discriminated union makes the state easier to reason about:

```typescript
type UserLoadState = { status: "idle" } | { status: "loading" } | { status: "success"; user: User } | { status: "empty" } | { status: "error"; message: string };
```

Then the component logic can branch on one field:

```typescript
state.status;
```

This helps with:

- safer rendering
- clearer templates
- easier refactoring
- fewer impossible states
- better communication between developers

This pattern also connects well to Angular services, signals, RxJS streams, and component state.

The specific Angular syntax may change, but the state modeling idea stays useful.

---

#### Interview Explanation

A strong interview answer could sound like this:

> Discriminated unions are helpful for frontend state because UI state usually has clear branches, such as idle, loading, success, empty, and error. Instead of using loose optional properties that can create confusing combinations, a discriminated union makes each possible state explicit. The shared discriminant property, usually something like `status`, lets TypeScript narrow the type inside a `switch` or `if` statement. That means the success branch can safely access `data`, while the error branch can safely access `message`. This makes render logic easier to read, harder to misuse, and safer to update as new UI states are added.

---

#### Final Takeaway

The main idea from this lesson is simple:

> The `status` tells TypeScript which shape the object has.

That is the power of discriminated unions.

They help turn frontend state from a loose collection of optional properties into a clear set of possible branches.

Instead of writing code that asks:

```typescript
Do I maybe have data?
Do I maybe have an error?
Am I maybe loading?
```

the code can ask:

```typescript
What status am I in?
```

Then TypeScript can help make the rest of the branch safe.

That makes discriminated unions one of the most useful TypeScript patterns for Angular and frontend development.
