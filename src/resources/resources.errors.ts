export class InsufficientBalanceError extends Error {
  amount: number;
  constructor(message: string, amount: number) {
    super(message);
    this.amount = amount;
  }
}
