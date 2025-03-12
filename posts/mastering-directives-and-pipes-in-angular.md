---
title: Mastering Directives and Pipes in Angular
description: "Learn all about DOM manipulation and transformation in this article on Directives and Pipes."
published: true
datePublished: December 8, 2024
picture: "assets/posts/timeforchange.jpg"
---

### **Mastering Directives and Pipes in Angular**

December 8th, 2024

Angular provides two powerful features—**Directives** and **Pipes**—that allow developers to manipulate the DOM and transform data seamlessly. These tools enhance the functionality of Angular applications and make code more reusable and concise.

In this blog post, we’ll explore what directives and pipes are, their types, and how to use them effectively with practical examples.

---

#### **What Are Directives in Angular?**

Directives are classes in Angular that can modify the structure or behavior of the DOM. There are three main types of directives:

1. **Structural Directives:** Alter the layout by adding, removing, or manipulating DOM elements.
2. **Attribute Directives:** Change the appearance or behavior of an element.
3. **Component Directives:** These are components themselves, considered directives with a template.

---

#### **Using Structural Directives**

Structural directives begin with an asterisk (\*) and manipulate the DOM by adding or removing elements.

**Example 1: Using** `*ngIf`

```html
<!-- app.component.html -->
<div *ngIf="isLoggedIn">
  <p>Welcome back, user!</p>
</div>
<div *ngIf="!isLoggedIn">
  <p>Please log in.</p>
</div>
```

**Component Code**

```typescript
// app.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  isLoggedIn = false;
}
```

**Explanation:**

The `*ngIf` directive dynamically includes or excludes elements from the DOM based on the condition.

**Example 2: Using** `*ngFor`

```html
<!-- app.component.html -->
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>
```

**Component Code**

```typescript
// app.component.ts
items = ["Apple", "Banana", "Cherry"];
```

**Explanation:**

The `*ngFor` directive iterates over the `items` array and creates a list element for each item.

---

#### **Using Attribute Directives**

Attribute directives modify the appearance or behavior of an element. A commonly used built-in attribute directive is `ngClass`.

**Example: Using** `ngClass`

```html
<!-- app.component.html -->
<div [ngClass]="{'highlight': isHighlighted, 'dim': !isHighlighted}">This text changes style based on the condition.</div>
```

**Component Code**

```typescript
// app.component.ts
isHighlighted = true;
```

Explanation:

The ngClass directive conditionally applies CSS classes based on the state of isHighlighted.

---

#### **Creating a Custom Directive**

Custom directives allow you to define unique DOM behaviors.

<em>Example: Highlight Directive</em>

**Directive Code**

```typescript
// highlight.directive.ts
import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener("mouseenter") onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = "yellow";
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = "";
  }
}
```

**Using the Directive**

```html
<!-- app.component.html -->
<p appHighlight>Hover over this text to see the highlight effect.</p>
```

---

#### **What Are Pipes in Angular?**

Pipes transform data for display in templates. Angular provides several built-in pipes, and you can also create custom ones.

**Using Built-in Pipes**

Here are a few commonly used pipes:

1. DatePipe

HTML (template):

```html
<p>Today’s date: {{ today | date }}</p>
```

TypeScript (component):

```typescript
today = new Date();
```

2. CurrencyPipe

HTML (template):

```html
<p>Price: {{ price | currency:'USD' }}</p>
```

TypeScript (component):

```typescript
price = 199.99;
```

3. UpperCasePipe

HTML (template):

```html
<p>{{ 'hello world' | uppercase }}</p>
```

---

#### **Creating a Custom Pipe**

Custom pipes let you define unique transformations.

<em>Example: Reverse String Pipe</em>

**Pipe Code**

```typescript
// reverse-string.pipe.ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "reverseString",
})
export class ReverseStringPipe implements PipeTransform {
  transform(value: string): string {
    return value.split("").reverse().join("");
  }
}
```

**Using the Pipe**

```html
<!-- app.component.html -->
<p>{{ 'Angular' | reverseString }}</p>
```

Output: `ralugnA`

---

#### **Combining Directives and Pipes**

Directives and pipes can work together to create dynamic templates.

**Example**

```html
<ul>
  <li *ngFor="let user of users">{{ user.name | uppercase }} - {{ user.joined | date:'shortDate' }}</li>
</ul>
```

```typescript
// app.component.ts
users = [
  { name: "Alice", joined: new Date(2023, 0, 15) },
  { name: "Bob", joined: new Date(2023, 5, 10) },
];
```

**Explanation:**

1. `*ngFor` iterates over the users array.
2. The `uppercase` pipe transforms names to uppercase.
3. The `date` pipe formats the joining date.

#### **Conclusion**

Directives and pipes are fundamental to Angular development. They enable powerful DOM manipulation and data transformation, making your applications more interactive and user-friendly. By mastering these tools, you can write clean, efficient, and maintainable code.

#### Resources

- <a href="https://angular.dev/guide/directives" target="_blank">Angular.dev Directives</a>
- <a href="https://angular.dev/guide/templates/pipes" target="_blank">Angular.dev Pipes</a>

#### Note:

*This post was generated with the assistance of <a href="https://chatgpt.com/" target="_blank">ChatGPT</a>.*

- *OpenAI. (2024). ChatGPT (Dec 8 version) [Large language model]. https://chat.openai.com/chat.*
