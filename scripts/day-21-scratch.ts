const orders = [
  { id: 1, customer: 'Ava', status: 'paid', total: 45 },
  { id: 2, customer: 'Maya', status: 'pending', total: 80 },
  { id: 3, customer: 'Noah', status: 'paid', total: 30 },
  { id: 4, customer: 'Liam', status: 'paid', total: 120 },
];

const paidOrderSummary = orders
  .filter((order) => order.status === 'paid')
  .map((order) => ({
    id: order.id,
    customer: order.customer,
    total: order.total,
  }))
  .sort((a, b) => b.total - a.total);

const paidTotal = paidOrderSummary.reduce((sum, order) => sum + order.total, 0);

console.log('Orders: ', orders);
console.log('Paid Total: ', paidTotal);

// updated using typescript to protect status, field values, etc

// create domain types
type OrderStatus = 'paid' | 'pending' | 'cancelled';

type Order = {
  readonly id: number;
  customer: string;
  status: OrderStatus;
  total: number;
};

type PaidOrderSummary = {
  readonly id: number;
  customer: string;
  total: number;
};

// type the data
const orders2: Order[] = [
  { id: 1, customer: 'Ava', status: 'paid', total: 45 },
  { id: 2, customer: 'Maya', status: 'pending', total: 80 },
  { id: 3, customer: 'Noah', status: 'paid', total: 30 },
  { id: 4, customer: 'Liam', status: 'paid', total: 120 },
];

// write the typed function
function getPaidOrderSummary(orders: readonly Order[]): PaidOrderSummary[] {
  return orders
    .filter((order) => order.status === 'paid')
    .map((order) => ({
      id: order.id,
      customer: order.customer,
      total: order.total,
    }))
    .sort((a, b) => b.total - a.total);
}

// write the typed reducer
function getOrderTotal(orders: readonly PaidOrderSummary[]): number {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

// use the functions
const paidOrderSummary2 = getPaidOrderSummary(orders2);
const paidTotal2 = getOrderTotal(paidOrderSummary2);

console.log(paidOrderSummary2);
console.log(paidTotal2);

type OrderSortKey = 'customer' | 'total';
type SortDirection = 'asc' | 'desc';

function sortPaidOrders(
  orders: readonly PaidOrderSummary[],
  sortKey: OrderSortKey,
  direction: SortDirection = 'asc',
): PaidOrderSummary[] {
  return [...orders].sort((a, b) => {
    let comparison = 0;

    if (sortKey === 'customer') {
      comparison = a.customer.localeCompare(b.customer);
    }

    if (sortKey === 'total') {
      comparison = a.total - b.total;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

type CheckpointState<T> =
  | { status: 'not-started' }
  | { status: 'in-progress' }
  | { status: 'complete'; data: T }
  | { status: 'needs-review'; weakSpots: string[] };

const checkpointState: CheckpointState<PaidOrderSummary[]> = {
  status: 'complete',
  data: paidOrderSummary,
};

const checkpointState2: CheckpointState<PaidOrderSummary[]> = {
  status: 'needs-review',
  weakSpots: ['reduce', 'generics'],
};

function renderCheckpointState(
  state: CheckpointState<PaidOrderSummary[]>,
): string {
  switch (state.status) {
    case 'not-started':
      return 'Not started yet.';

    case 'in-progress':
      return 'In progress...';

    case 'complete':
      return `Completed ${state.data.length} orders.`;

    case 'needs-review':
      return `Needs review: ${state.weakSpots}.`;
  }
}
console.log(renderCheckpointState(checkpointState));
console.log(renderCheckpointState(checkpointState2));
