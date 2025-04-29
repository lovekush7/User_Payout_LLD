import { SaleStatus } from "./Enums";

export class Sale {
    constructor(
      public saleId: string,
      public userId: string,
      public brand: string,
      public earning: number,
      public status: SaleStatus = SaleStatus.PENDING,
      public advancePayoutGiven: boolean = false,
      public payoutId: string = ''
    ) {}
  }
  