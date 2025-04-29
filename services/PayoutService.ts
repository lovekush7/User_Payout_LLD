import { Payout } from "../Models/Payout";
import { User } from "../Models/User";
import { Sale } from "../Models/Sale";
import { SaleStatus } from "../Models/Enums";
import { PayoutStatus } from "../Models/Enums";
import { PayoutPartnerService } from "./PayoutPartnerServices";

export class PayoutService {
  constructor(
    private payoutDB: Map<string, Payout>,
    private usersDB: Map<string, User>,
    private salesDB: Map<string, Sale>
  ) {}

  processAdvancePayout(userId: string, sale: Sale) {
    const advance = sale.earning * 0.1;
    const user = this.usersDB.get(userId)!;
    user.totalAdvancePaid += advance;
    sale.advancePayoutGiven = true;

    const payout = new Payout(Date.now().toString(), userId, advance, sale.saleId, PayoutStatus.PENDING);
    if (payout instanceof Error) {
      new PayoutPartnerService(new PayoutService(this.payoutDB, this.usersDB, this.salesDB)).reportPayoutFailure(payout.payoutId, sale.saleId);
      throw payout;
    }
    this.payoutDB.set(payout.payoutId, payout);
    this.usersDB.set(userId, user);
  }

  finalizeEarningsPayout(userId: string, saleId: string) {
    const sale = this.salesDB.get(saleId)!;
    const user = this.usersDB.get(userId)!;
    let finalAmount = 0;
    
    if (sale.status === SaleStatus.APPROVED) {
      finalAmount = sale.earning - (sale.advancePayoutGiven ? sale.earning * 0.1 : 0);
      user.totalEarnings += sale.earning;
    } else if ((sale.status === SaleStatus.DECLINED || sale.status === SaleStatus.CANCELLED) && sale.advancePayoutGiven) {
      finalAmount = -sale.earning * 0.1;
      user.totalAdvancePaid -= sale.earning;
      new PayoutPartnerService(new PayoutService(this.payoutDB, this.usersDB, this.salesDB)).reportCancelledOrDeclinedPayout(sale.payoutId, saleId);
    }

    const payout = this.payoutDB.get(sale.payoutId)!;
    this.payoutDB.set(sale.payoutId, { ...payout, amount: payout.amount + finalAmount }  );
    this.usersDB.set(userId, user);
  }

  reverseFailedPayout(payoutId: string, saleId: string) {
    const payout = this.payoutDB.get(payoutId)!;
    const user = this.usersDB.get(payout.userId)!;
    if (SaleStatus.APPROVED) {
      user.totalEarnings -= payout.amount;
    } else if (SaleStatus.DECLINED || SaleStatus.CANCELLED) {
      user.totalAdvancePaid -= payout.amount;
    }
    this.salesDB.set(saleId, { ...this.salesDB.get(saleId)!, advancePayoutGiven: false });
    this.usersDB.set(payout.userId, user);
    this.payoutDB.set(payoutId, { ...payout, status: PayoutStatus.REJECTED || PayoutStatus.CANCELLED || PayoutStatus.FAILED });
  }

  getPayouts(userId: string): Payout[] {
    return [...this.payoutDB.values()].filter(payout => payout.userId === userId);
  }
}
