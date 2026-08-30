type RegistrationForm = {
  username: string;
  email: string;
  password: string;
  age: number;
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

type RegistrationErrors = ValidationErrors<RegistrationForm>;

const errors: RegistrationErrors = {
  username: 'Chris',
  email: 'chris@chris.com',
};

type ApiResponse<T> = {
  data: T;
  success: boolean;
};

type Customer = {
  id: number;
  name: string;
  email: string;
};

type ResponseItem<T> = T extends Array<infer U> ? U : T;

type CustomerItem = ResponseItem<Customer[]>;
type StringItem = ResponseItem<string[]>;
type NumberItem = ResponseItem<number[]>;
type SingleCustomer = ResponseItem<Customer>;
