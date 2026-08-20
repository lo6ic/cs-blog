type TaskStatus23 = 'todo' | 'in-progress' | 'done';
type TaskPriority23 = 'low' | 'medium' | 'high';

type Task23 = {
  readonly id: number;
  readonly createdAt: string;
  title: string;
  description?: string;
  status: TaskStatus23;
  priority: TaskPriority23;
  assignedTo?: string;
  dueDate?: string;
};

type CreateTaskInput = Omit<Task23, 'id' | 'createdAt'>; // removes selected properties
type UpdateTaskInput = Partial<CreateTaskInput>; // makes every property optional

const createTask: CreateTaskInput = {
  title: 'Write Angular Tests',
  status: 'todo',
  priority: 'high',
};

const updateTask: UpdateTaskInput = {
  status: 'done',
};

console.log('createTask', createTask);
console.log('updateTask', updateTask);

type TaskFormDraft = Partial<CreateTaskInput>; // makes every property optional
type ValidatedTaskForm = Required<CreateTaskInput>; // makes every property required

const formDraft: TaskFormDraft = {
  title: 'Draft title',
};

const validTaskForm: ValidatedTaskForm = {
  title: 'The Form',
  description: 'A valid task form.',
  status: 'in-progress',
  priority: 'low',
  dueDate: '2026-08-23',
  assignedTo: 'Chris',
};

console.log('formDraft: ', formDraft);
console.log('validTaskForm: ', validTaskForm);

type TaskCardViewModel = Pick<Task23, 'id' | 'title' | 'status' | 'priority'>; // keeps only these selected properties from Task23
type ReadonlyTaskCard = Readonly<TaskCardViewModel>; // makes all properties readonly

const card: ReadonlyTaskCard = {
  id: 1,
  title: 'Write Angular Tests',
  status: 'todo',
  priority: 'high',
};

//card.title = 'Angular Tests';

type TaskStatusLabels = Record<TaskStatus23, string>;
type TaskPriorityLabels = Record<TaskPriority23, string>;

const statusLabels: TaskStatusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const priorityLabels: TaskPriorityLabels = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

function mapTaskToCard(task: Task23) {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    isOverdue: Boolean(task.dueDate && task.status !== 'done'),
  };
}

type TaskCard = ReturnType<typeof mapTaskToCard>;

const mappedCard: TaskCard = mapTaskToCard({
  id: 33,
  createdAt: '2026-08-22',
  title: 'My Task',
  description: 'The task I must do.',
  priority: 'medium',
  status: 'todo',
  assignedTo: 'Chris',
});

console.log('mappedCard: ', mappedCard);
