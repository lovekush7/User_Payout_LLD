import { PayoutStatus } from './Enums';

export class Payout {
    constructor(
      public payoutId: string,
      public userId: string,
      public amount: number,
      public saleId: string,
      public status: PayoutStatus,
      public date: Date = new Date()
    ) {}
  }
  