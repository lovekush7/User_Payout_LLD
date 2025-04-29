import { PayoutService } from "./PayoutService";

export class PayoutPartnerService {
  constructor(private payoutService: PayoutService) {}

  // both services call this method we can make it one service also.
  reportCancelledOrDeclinedPayout(payoutId: string, saleId: string) { 
    this.payoutService.reverseFailedPayout(payoutId, saleId); // reverse the payout if it cancels or declines
  }

  reportPayoutFailure(payoutId: string, saleId: string) { 
    this.payoutService.reverseFailedPayout(payoutId, saleId); // reverse the payout if it fails
  }
}
