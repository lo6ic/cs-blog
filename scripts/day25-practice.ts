class UserAccount {
  readonly id: number;
  username: string;
  private password: string;

  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
  }

  checkPassword(password: string): boolean {
    return this.password === password;
  }
}

const account = new UserAccount(1, 'Chris', 'oldPassword');

console.log(account.id);
console.log(account.username);

console.log(account.checkPassword('wrong')); // false
console.log(account.checkPassword('oldPassword')); // true

account.changePassword('newPassword');

console.log(account.checkPassword('newPassword')); // true

class Vehicle {
  public make: string;
  private vin: string;
  protected currentSpeed: number;

  constructor(make: string, vin: string) {
    this.make = make;
    this.vin = vin;
    this.currentSpeed = 0;
  }

  getVin(): string {
    return this.vin;
  }

  stop(): void {
    this.currentSpeed = 0;
  }
}

class Car extends Vehicle {
  accelerate(): void {
    this.currentSpeed += 10;
  }

  getSpeed(): number {
    return this.currentSpeed;
  }
}

const car = new Car('Toyota', 'ABC123');

car.accelerate();
car.accelerate();

console.log(car.getSpeed()); // 20
console.log(car.make); // Toyota
console.log(car.getVin()); // ABC123

abstract class ANotification {
  public recipient: string;

  constructor(recipient: string) {
    this.recipient = recipient;
  }

  log(): void {
    console.log(`Sending notification to ${this.recipient}`);
  }

  abstract send(message: string): void;
}

class EmailNotification extends ANotification {
  send(message: string) {
    console.log(`Emailing "${message}" to ${this.recipient} `);
  }
}

class SmsNotification extends ANotification {
  send(message: string) {
    console.log(`Texting "${message}" to ${this.recipient}`);
  }
}

const email = new EmailNotification('chris@example.com');
const sms = new SmsNotification('555-1234');

email.log();
email.send('Hello!');

sms.log();
sms.send('Hello!');
