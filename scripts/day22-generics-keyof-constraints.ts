function updateField<T, K extends keyof T>(
  item: T, // T is the object type
  key: K, // K is one valid key of T
  value: T[K], // T[K] the value type of the key
): T {
  return {
    ...item,
    [key]: value,
  };
}

type User = {
  readonly id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
};

const me: User = {
  id: 1,
  name: 'Chris',
  email: 'chris@chris.com',
  role: 'member',
};

const userWithNewName = updateField(me, 'name', 'Christopher');
const userWithNewEmail = updateField(me, 'email', 'christopher@example.com');
const userWithNewRole = updateField(me, 'role', 'admin');

console.log('userWithNewName', userWithNewName);
console.log('userWithNewEmail', userWithNewEmail);
console.log('userWithNewRole', userWithNewRole);

type TaskStatus = 'todo' | 'in-progress' | 'done';

type Task = {
  readonly id: number;
  title: string;
  status: TaskStatus;
  assignedTo?: string;
};

const theTask: Task = {
  id: 1,
  title: 'Wash clothes',
  status: 'todo',
  assignedTo: 'Chris',
};

const taskWithNewTitle = updateField(theTask, 'title', 'Write unit tests');
const taskInProgress = updateField(theTask, 'status', 'in-progress');
const taskAssigned = updateField(theTask, 'assignedTo', 'Christopher');

console.log('taskWithNewTitle', taskWithNewTitle);
console.log('taskInProgress', taskInProgress);
console.log('taskAssigned', taskAssigned);

type EditableUserKey = 'name' | 'email' | 'role';

function updateUserField<K extends EditableUserKey>(
  user: User,
  key: K,
  value: User[K],
): User {
  return {
    ...user,
    [key]: value,
  };
}

const editedUser = updateUserField(me, 'name', 'Christopher');
console.log('editedUser', editedUser);

function getField<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}

const userName = getField(me, 'name');
const userRole = getField(me, 'role');
const taskStatus = getField(theTask, 'status');

console.log('userName', userName);
console.log('userRole', userRole);
console.log('taskStatus', taskStatus);
