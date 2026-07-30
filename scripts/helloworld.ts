// const message: string = 'Hello, TypeScript!';
// console.log(message);

import { error } from 'node:console';
import { format } from 'node:path';

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   active: boolean;
// };

// const user: User = {
//   id: 1,
//   name: 'Test User',
//   email: 'test@user.com',
//   active: true,
// };

// function formatUserName(user: User): string {
//   return user.name.toUpperCase();
// }

// console.log(formatUserName(user));

// let selectedUser: User | null = null;

// function printSelectedUser() {
//   if (!selectedUser) {
//     console.log('No selected user.');
//     return;
//   }
//   console.log(selectedUser.name);
// }

// // Exercise 1
// type Product = {
//   id: number;
//   title: string;
//   price: number;
//   inStock: boolean;
// };

// const product: Product = {
//   id: 101,
//   title: 'Angular Course',
//   price: 49.99,
//   inStock: true,
// };

// // Exercise 2
// function formatPrice(price: number): string {
//   return '$' + price.toFixed(2);
// }

// console.log(formatPrice(49.99));

// // Exercise 3
// type Profile = {
//   id: number;
//   username: string;
//   email: string;
// };

// let currentProfile: Profile | null = null;

// function printProfileEmail() {
//   if (!currentProfile) {
//     console.log('No current profile.');
//     return;
//   }
//   console.log(currentProfile.email);
// }

// console.log(printProfileEmail());

// // Exercise 4
// const scores = [90, 85, 100];

// scores.push(95);

// function averageScore(scores: number[]): number {
//   let average: number = 0;

//   if (!scores) {
//     console.log('No scores were given.');
//     return 0;
//   }

//   average = scores.reduce((average, score) => (average += score), 0);
//   console.log('Average after reducer:' + average);
//   console.log('Scores length: ' + scores.length);

//   average = average / scores.length;

//   return average;
// }

// console.log(averageScore(scores));

// // Exercise 5
// type RawUser = {
//   id: number;
//   name: string;
//   email: string;
//   company: {
//     name: string;
//   };
// };

// type UserViewModel = {
//   id: number;
//   displayName: string;
//   contact: string;
//   companyName: string;
// };

// function mapUserToViewModel(rawUser: RawUser): UserViewModel {
//   let uvm = {
//     id: 0,
//     displayName: '',
//     contact: '',
//     companyName: '',
//   };

//   if (!rawUser) {
//     console.log('No raw user given.');
//     return uvm;
//   }

//   uvm.id = rawUser.id;
//   uvm.displayName = rawUser.name;
//   uvm.contact = rawUser.email;
//   uvm.companyName = rawUser.company.name;

//   return uvm;
// }

// const rawUser: RawUser = {
//   id: 1,
//   name: 'Maya Chen',
//   email: 'maya@example.com',
//   company: {
//     name: 'Remote Dev Studio',
//   },
// };

// console.log(mapUserToViewModel(rawUser));

// Day 16
/*type TransactionStatus = 'pending' | 'cleared' | 'failed';

type Transaction = {
  readonly id: number;
  readonly createdAt: string;
  readonly source: 'bank' | 'manual' | 'imported';
  merchant: string;
  amount: number;
  status: TransactionStatus;
  category?: string;
  notes?: string;
};

const transactions: Transaction[] = [
  {
    id: 1,
    createdAt: '01-01-2026',
    source: 'bank',
    merchant: 'Best Buy',
    amount: 29.99,
    status: 'pending',
  },
  {
    id: 2,
    createdAt: '01-02-2026',
    source: 'manual',
    merchant: 'Fishing Is Us',
    amount: 9.99,
    status: 'pending',
    category: 'fishing',
    notes: 'how to fish',
  },
  {
    id: 3,
    createdAt: '02-02-2026',
    source: 'imported',
    merchant: 'Carmax',
    amount: 29999.99,
    status: 'cleared',
    category: 'car',
    notes: 'BMW',
  },
];

transactions[0].category = 'Education';
transactions[1].status = 'cleared';
transactions[2].notes = 'Reviewed manually';

//transactions[0].id = 999;
//transactions[1].createdAt = "03-09-2026";
//transactions[2].source = "manual";

const lockedTransactions: readonly Transaction[] = transactions;

//lockedTransactions.push()
//lockedTransactions.pop()
//localStorage.sort()

lockedTransactions[0].status = 'failed';

type TransactionTuple = readonly [number, string, number];

const tTuple: TransactionTuple = [1, 'hi', 2];
// What is less readable about this compared to a Transaction object?
// tuple is shorter but you don't know the meaning of each entry as they aren't key-value pairs

function printTransactionSummary(transactions: readonly Transaction[]): void {
  if (transactions.length === 0) {
    console.log('No transactions');
    return;
  }
  for (let tr = 0; tr < transactions.length; tr++) {
    console.log(
      transactions[tr].merchant +
        ' - $' +
        transactions[tr].amount +
        ' - ' +
        transactions[tr].status,
    );
  }

  transactions.forEach((trans) => {
    console.log(`${trans.merchant} - $${trans.amount} - ${trans.status}`);
  });

  //transactions.push()
  return;
}

printTransactionSummary(transactions);*/

// Day 17 interfaces/types
// interface UserInterface {
//   readonly id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'member';
// }

// type UserType = {
//   readonly id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'member';
// };

// let userI: UserInterface = {
//   id: 1,
//   name: 'chris',
//   email: 'chris@chris.com',
//   role: 'admin',
// };

// console.log('userI: ', userI);

// let userT: UserType = {
//   id: 2,
//   name: 'john',
//   email: 'john@john.com',
//   role: 'member',
// };

// console.log('userT: ', userT);

// interface BudgetItemInterface {
//   readonly id: number;
//   label: string;
//   amount: number;
//   category: string;
//   isRecurring: boolean;
// }

// type BudgetItemType = {
//   readonly id: number;
//   label: string;
//   amount: number;
//   category: string;
//   isRecurring: boolean;
// };

// let biI: BudgetItemInterface = {
//   id: 5,
//   label: 'testlabel',
//   amount: 10,
//   category: 'testcat',
//   isRecurring: true,
// };

// let biT: BudgetItemType = {
//   id: 6,
//   label: 'bit label',
//   amount: 20,
//   category: 'testing category again',
//   isRecurring: false,
// };

// console.log('biI: ', biI);
// console.log('biT: ', biT);

// type TaskStatus = 'todo' | 'in-progress' | 'done';

// interface TaskInterface {
//   readonly id: number;
//   title: string;
//   status: TaskStatus;
//   assignedTo?: string;
// }

// type TaskType = {
//   readonly id: number;
//   title: string;
//   status: TaskStatus;
//   assignedTo?: string;
// };

// // const badTask: TaskType = {
// //   id: 1,
// //   title: "Fix login",
// //   status: "blocked"
// // };

// interface BaseEntityInterface {
//   readonly id: number;
//   createdAt: string;
// }

// interface ProjectInterface extends BaseEntityInterface {
//   name: string;
//   status: 'active' | 'archived';
// }

// interface ProjectInterface2 extends ProjectInterface {
//   foo: string;
// }

// type BaseEntityType = {
//   readonly id: number;
//   createdAt: string;
// };

// type ProjectType = BaseEntityType & {
//   name: string;
//   status: 'active' | 'archived';
// };

// type ProjectType2 = ProjectType & {
//   foo: string;
// };

// let pi2: ProjectInterface2 = {
//   id: 111,
//   createdAt: '01-01-1990',
//   name: 'testname',
//   status: 'active',
//   foo: 'bar',
// };

// let pt2: ProjectType2 = {
//   id: 121,
//   createdAt: '01-02-1990',
//   name: 'testname2',
//   status: 'archived',
//   foo: 'BAR;',
// };

// console.log('pi2: ', pi2);
// console.log('pt2:', pt2);

// // Which one reads better to you and why?
// // I feel like the interface reads better when you want to 'extend' it, the 'extends' keyword helps the reader/developer
// // understand what you are trying to do with it.  The '&' doesn't really convey what it going on.

// type UserLoadState =
//   | { status: 'idle' }
//   | { status: 'loading' }
//   | { status: 'success'; user: UserType }
//   | { status: 'error'; message: string };
// const idleState: UserLoadState = { status: 'idle' };
// const loadingState: UserLoadState = { status: 'loading' };
// const successState: UserLoadState = {
//   status: 'success',
//   user: {
//     id: 22,
//     name: 'jack',
//     email: 'jack@beanstock.com',
//     role: 'member',
//   },
// };
// const errorState: UserLoadState = { status: 'error', message: '404' };

// const stateArray: UserLoadState[] = [
//   idleState,
//   loadingState,
//   successState,
//   errorState,
// ];

// for (let state of stateArray) {
//   console.log(state);
// }

// // interface vs type in angular app
// /*
// I would use either/or for simple object definitions.  However, I would lean more toward interfaces when using model definitions
// of class like objects.
// I would use types for their union abilities and would usually use them for state/status labels.
// I would also defer to whatever the team uses to keep consistency alive.
// */

// // 1
// type ButtonVariant = 'primary' | 'secondary' | 'danger';

// // 2
// interface UserProfile {
//   id: number;
//   displayName: string;
//   email: string;
// }

// // 3
// type ApiState =
//   | { status: 'loading' }
//   | { status: 'success'; data: string[] }
//   | { status: 'error'; message: string };

// Day 18 - Unions, Narrowing, and Discriminated Unions

// function formatValue(value: string | number): string {
//   if (typeof value === 'string') {
//     return value.toUpperCase();
//   }

//   return value.toFixed(2);
// }

// console.log(formatValue('Testing'));
// console.log(formatValue(2121));

// type ButtonVariant = 'primary' | 'secondary' | 'danger';

// function getButtonClass(variant: ButtonVariant): string {
//   switch (variant) {
//     case 'primary':
//       return 'btn-primary';
//     case 'secondary':
//       return 'btn-secondary';
//     case 'danger':
//       return 'btn-danger';
//     default:
//       return '';
//   }
// }

// console.log(getButtonClass('primary'));

// console.log(getButtonClass('secondary'));

// console.log(getButtonClass('danger'));

// //console.log(getButtonClass('warning'));

// type RequestState<T> =
//   | { status: 'idle' }
//   | { status: 'loading' }
//   | { status: 'success'; data: T }
//   | { status: 'error'; message: string }
//   | { status: 'empty' };

// type User = {
//   readonly id: number;
//   name: string;
//   email: string;
// };

// const idleState: RequestState<User> = { status: 'idle' };
// const loadingState: RequestState<User> = { status: 'loading' };
// const successState: RequestState<User> = {
//   status: 'success',
//   data: {
//     id: 1,
//     name: 'chris',
//     email: 'chris@test.com',
//   },
// };
// const errorState: RequestState<User> = {
//   status: 'error',
//   message: '404 No User',
// };
// const emptyState: RequestState<User> = {
//   status: 'empty',
// };

// console.log('idle: ', idleState);
// console.log('loading: ', loadingState);
// console.log('success: ', successState);
// console.log('error: ', errorState);

// function assertNever(value: never): never {
//   throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
// }

// function renderUserState(state: RequestState<User>): string {
//   switch (state.status) {
//     case 'idle':
//       return 'No user requested yet.';
//     case 'loading':
//       return 'Loading user...';
//     case 'success':
//       return `User: ${state.data.name} - ${state.data.email}`;
//     case 'error':
//       return `Error: ${state.message}`;
//     case 'empty':
//       return 'No data found.';
//     default:
//       return assertNever(state);
//   }
// }

// console.log('idle state: ', renderUserState(idleState));
// console.log('loading state: ', renderUserState(loadingState));
// console.log('success state: ', renderUserState(successState));
// console.log('error state: ', renderUserState(errorState));
// console.log('empty state: ', renderUserState(emptyState));

// Day 19

// function identity<T>(value: T): T {
//   return value;
// }

// const courseName = identity('Angular TypeScript');
// // string
// console.log(courseName);

// const lessonCount = identity(19);
// // number
// console.log(lessonCount);

// function firstItem<T>(items: T[]): T | undefined {
//   return items[0];
// }

// const firstName = firstItem(['Maya', 'Chris', 'Ava']);
// // string | undefined
// console.log(firstName);

// const firstScore = firstItem([95, 88, 100]);
// // number | undefined
// console.log(firstScore);

// const nothingA = firstItem([]);
// console.log(nothingA);

// function pluck<T, K extends keyof T>(item: T, key: K): T[K] {
//   return item[key];
// }

// type User = {
//   readonly id: number;
//   name: string;
//   email: string;
// };

// const user: User = {
//   id: 1,
//   name: 'Maya',
//   email: 'maya@example.com',
// };

// const name = pluck(user, 'name');
// const id = pluck(user, 'id');
//const error1 = pluck(user, 'test');

//console.log(name + ' | ' + id);

console.log('EXERCISES:');
// Exercise 1
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
console.log(formatCurrency(19));

console.log(formatCurrency(20.99));
function formatIsPositive(value: number): boolean {
  return value > 0;
}
console.log(formatIsPositive(9));
console.log(formatIsPositive(-9));

// Exercise 2
function identity<T>(value: T): T {
  return value;
}
const name = identity('Angular');
const count = identity(19);
const active = identity(true);
console.log(name);
console.log(count);
console.log(active);

// Exercise 3
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}
const firstNumber = firstItem([10, 20, 30]);
const firstString = firstItem(['Angular', 'TypeScript']);
const empty = firstItem([]);

console.log(firstNumber);
console.log(firstString);
console.log(empty);

// Exercise 4
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
  label: 'Angular Course',
  amount: 49.99,
  category: 'Education',
};

const label = pluck(budgetItem, 'label');
const amount = pluck(budgetItem, 'amount');
console.log(label);
console.log(amount);

type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

type User = {
  readonly id: number;
  name: string;
  email: string;
};

const userSuccess: ApiResponse<User> = {
  status: 'success',
  data: {
    id: 1,
    name: 'Chris',
    email: 'chris@test.com',
  },
};
const userError: ApiResponse<User> = {
  status: 'error',
  message: 'There was an error with this user.',
};
const usersSuccess: ApiResponse<User[]> = {
  status: 'success',
  data: [
    {
      id: 2,
      name: 'Joe',
      email: 'joe@joe.com',
    },
    {
      id: 3,
      name: 'Kate',
      email: 'kate@kate.com',
    },
  ],
};

function renderApiResponse<T>(response: ApiResponse<T>): string {
  switch (response.status) {
    case 'success':
      return 'Success';
    case 'error':
      return `Error: ${response.message}`;
  }
}

// Exercise 6
// if response is error, return same error message
// if response is success, return success with mapped data

function mapApiResponse<T, U>(
  response: ApiResponse<T>,
  mapper: (data: T) => U,
): ApiResponse<U> {
  switch (response.status) {
    case 'success':
      return {
        status: 'success',
        data: mapper(response.data),
      };

    case 'error':
      return {
        status: 'error',
        message: response.message,
      };
  }
}

const mappedName = mapApiResponse(userSuccess, (user) => user.name);
const mappedEmails = mapApiResponse(usersSuccess, (users) =>
  users.map((user) => user.email),
);

console.log(mappedName);
console.log(mappedEmails);

/*
what problems do generics solve?

Generics are useful to preserve data type for creating reusable code.  They are used so you don't need to fall 
back and use 'any' or 'unkown'.  This keeps the TypeScript type feature alive and well.  They are used in 
both input and output forms.


*/
