const message: string = 'Hello, TypeScript!';
console.log(message);

type User = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};

const user: User = {
  id: 1,
  name: 'Test User',
  email: 'test@user.com',
  active: true,
};

function formatUserName(user: User): string {
  return user.name.toUpperCase();
}

console.log(formatUserName(user));

let selectedUser: User | null = null;

function printSelectedUser() {
  if (!selectedUser) {
    console.log('No selected user.');
    return;
  }
  console.log(selectedUser.name);
}

// Exercise 1
type Product = {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
};

const product: Product = {
  id: 101,
  title: 'Angular Course',
  price: 49.99,
  inStock: true,
};

// Exercise 2
function formatPrice(price: number): string {
  return '$' + price.toFixed(2);
}

console.log(formatPrice(49.99));

// Exercise 3
type Profile = {
  id: number;
  username: string;
  email: string;
};

let currentProfile: Profile | null = null;

function printProfileEmail() {
  if (!currentProfile) {
    console.log('No current profile.');
    return;
  }
  console.log(currentProfile.email);
}

console.log(printProfileEmail());

// Exercise 4
const scores = [90, 85, 100];

scores.push(95);

function averageScore(scores: number[]): number {
  let average: number = 0;

  if (!scores) {
    console.log('No scores were given.');
    return 0;
  }

  average = scores.reduce((average, score) => (average += score), 0);
  console.log('Average after reducer:' + average);
  console.log('Scores length: ' + scores.length);

  average = average / scores.length;

  return average;
}

console.log(averageScore(scores));

// Exercise 5
type RawUser = {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
};

type UserViewModel = {
  id: number;
  displayName: string;
  contact: string;
  companyName: string;
};

function mapUserToViewModel(rawUser: RawUser): UserViewModel {
  let uvm = {
    id: 0,
    displayName: '',
    contact: '',
    companyName: '',
  };

  if (!rawUser) {
    console.log('No raw user given.');
    return uvm;
  }

  uvm.id = rawUser.id;
  uvm.displayName = rawUser.name;
  uvm.contact = rawUser.email;
  uvm.companyName = rawUser.company.name;

  return uvm;
}

const rawUser: RawUser = {
  id: 1,
  name: 'Maya Chen',
  email: 'maya@example.com',
  company: {
    name: 'Remote Dev Studio',
  },
};

console.log(mapUserToViewModel(rawUser));
