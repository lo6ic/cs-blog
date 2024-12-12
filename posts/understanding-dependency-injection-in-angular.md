---
title: Understanding Dependency Injection in Angular
description: Come learn about Dependency Injection with Angular!
published: true
datePublished: December 5, 2024
picture: "assets/posts/cords.jpg"
---

### **Understanding Dependency Injection in Angular**

December 5th, 2024

Dependency Injection (DI) is a fundamental design pattern in Angular that fosters code modularity, maintainability, and testability. Angular's powerful built-in DI system simplifies the management of dependencies, allowing developers to focus on building robust and scalable applications.

In this article, we’ll cover:
1. An overview of Dependency Injection
2. Creating an injectable service
3. Defining dependency providers
4. Injection context
5. Hierarchical injectors
6. An overview of Injection Tokens
7. Conclusion

---

### **1. Overview of Dependency Injection**

Dependency Injection is a design pattern in which an object’s dependencies are provided to it rather than the object creating them itself. This approach decouples the creation and usage of dependencies, making the code more flexible and easier to maintain.

In Angular, DI ensures that services and other dependencies are injected into components, directives, or other services automatically by Angular's injector.

**Key Benefits of DI in Angular**:
- **Loose Coupling**: Components and services are independent of their dependencies’ implementations.
- **Reusability**: Dependencies can be reused across different parts of the application.
- **Testability**: Dependencies can be mocked during testing.

---

### **2. Creating an Injectable Service**

Angular services are the backbone of DI. They encapsulate reusable logic and can be injected into components or other services.

#### **Creating a Service**

Use the `@Injectable` decorator to make a class available for DI.

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Registers the service at the root level
})
export class LoggerService {
  log(message: string): void {
    console.log(`LoggerService: ${message}`);
  }
}
```

**Using the Service**

Inject the service into a component’s constructor:

```typescript
import { Component, OnInit } from '@angular/core';
import { LoggerService } from './logger.service';

@Component({
  selector: 'app-example',
  template: `<h1>Check the console for logs</h1>`,
})
export class ExampleComponent implements OnInit {
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.log('ExampleComponent initialized');
  }
}
```

---

### **3. Defining Dependency Providers**

A provider tells Angular how to create or obtain a dependency. Angular registers providers in the dependency injection system so they can be used across the application.

**Default Providers**

By default, services with `@Injectable({ providedIn: 'root' })` are registered in the root injector.

**Custom Providers**

Custom providers allow more control over how dependencies are created.

A Class Provider is a type of dependency injection provider that specifies which class should be used to satisfy a dependency. It tells Angular to use a particular class (or a subclass) to create an instance of the required service or dependency.

Class providers are defined in the `providers` array of an Angular module or component and use the `useClass` property.

Example: **Using a Class Provider**

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  fetchData(): string {
    return 'Data from API';
  }
}

@NgModule({
  providers: [{ provide: ApiService, useClass: ApiService }],
})
export class AppModule {}
```

A factory provider in Angular is a type of provider that uses a factory function to create a dependency. This approach is useful when the dependency requires custom logic or dynamic data to initialize, such as configuration settings or environment-specific services.

Example: **Using a Factory Provider**

```typescript
export function loggerFactory(): LoggerService {
  return new LoggerService();
}

@NgModule({
  providers: [{ provide: LoggerService, useFactory: loggerFactory }],
})
export class AppModule {}
```

---

### **4. Injection Context**

The context of dependency injection determines where a service is available and how it behaves.

**Global Context**

Services provided in the 'root' injector (via `@Injectable({ providedIn: 'root' })`) are globally available throughout the application.

**Component Context**

Services can also be scoped to a specific component using the providers array in the component decorator.

```typescript
@Component({
  selector: 'app-child',
  template: `<p>Child Component</p>`,
  providers: [LoggerService], // Scoped to this component and its descendants
})

export class ChildComponent {
  constructor(private logger: LoggerService) {
    this.logger.log('ChildComponent has its own LoggerService instance');
  }
}
```

--- 

### **5. Hierarchical Injectors**

Angular uses a hierarchical injector system to resolve dependencies. This system allows for flexibility in providing services at different levels of the component tree.

**Root Injector**

- The root injector is created when the application starts.
- Services provided in `@Injectable({ providedIn: 'root' })` or in the AppModule are registered here.

**Component-Level Injectors**

Each component has its own injector. Services provided in the providers array of a component are created specifically for that component and its descendants.

Example:
```typescript
@Component({
  selector: 'app-parent',
  template: `<app-child></app-child>`,
  providers: [LoggerService],
})
export class ParentComponent {}

@Component({
  selector: 'app-child',
  template: `<p>Child Component</p>`,
})
export class ChildComponent {
  constructor(private logger: LoggerService) {
    this.logger.log('ChildComponent logs with ParentComponent’s LoggerService');
  }
}
```

---

### **6. Overview of Injection Tokens**

When you need to inject values that aren’t classes (e.g., configuration objects or primitive values), you can use Injection Tokens.

**Defining an Injection Token**

```typescript
import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');
```

**Providing the Token**

```typescript
@NgModule({
  providers: [{ provide: API_URL, useValue: 'https://api.example.com' }],
})
export class AppModule {}
```

**Injecting the Token**

```typescript
import { Component, Inject } from '@angular/core';
import { API_URL } from './app.tokens';

@Component({
  selector: 'app-root',
  template: `<h1>API URL: {{ apiUrl }}</h1>`,
})
export class AppComponent {
  constructor(@Inject(API_URL) public apiUrl: string) {}
}
```

---

### **7. Conclusion**

Dependency Injection is a foundational feature of Angular, enabling developers to build scalable, maintainable, and testable applications. By understanding concepts such as injectors, providers, injection context, hierarchical injectors, and injection tokens, you can harness the full potential of Angular’s DI system.

With DI, you can ensure:

- Separation of concerns.
- Flexibility in managing dependencies.
- Enhanced testing capabilities.

Start leveraging Angular’s DI system today to write cleaner, modular, and robust applications!

#### **Resources**

- <a href="https://angular.dev/guide/di" target="_blank">Angular.dev Dependency Injection</a>

#### Note:

*This post was generated with the assistance of <a href="https://chatgpt.com/" target="_blank">ChatGPT</a>.*

- *OpenAI. (2024). ChatGPT (Dec 5 version) [Large language model]. https://chat.openai.com/chat.*