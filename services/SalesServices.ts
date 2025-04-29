import { Sale } from "../Models/Sale";
import { SaleStatus } from "../Models/Enums";
import { PayoutService } from "./PayoutService";
import { Payout } from "../Models/Payout";
import { User } from "../Models/User";

export class SalesService {
  constructor(public salesDB: Map<string, Sale>) {}

  createSale(sale: Sale) {
    // transaction starts
    try {
        new PayoutService(new Map<string, Payout>(), new Map<string, User>(), this.salesDB).processAdvancePayout(sale.userId, sale);
        this.salesDB.set(sale.saleId, sale);
        // commit transaction
    } catch (error) {
        // transaction.rollback();
        throw error;
    }
    // transaction ends
  }

  // only admin can reconcile a sale
  reconcileSale(saleId: string, newStatus: SaleStatus) {
    // transaction starts
    try {
        const sale = this.salesDB.get(saleId);
        if (!sale) throw new Error("Sale not found");
        if (sale.status === newStatus) return;
        sale.status = newStatus;
        if (newStatus === SaleStatus.APPROVED) {
            new PayoutService(new Map<string, Payout>(), new Map<string, User>(), this.salesDB).finalizeEarningsPayout(sale.userId, sale.saleId);
        }
        else if (newStatus === SaleStatus.DECLINED) {
            new PayoutService(new Map<string, Payout>(), new Map<string, User>(), this.salesDB).finalizeEarningsPayout(sale.userId, sale.saleId);
        }
        this.salesDB.set(saleId, sale);
        // commit transaction
    } catch (error) {
        // transaction.rollback();
        throw error;
    }
    // transaction ends
  }

  getPendingSalesForUser(userId: string): Sale[] { // get all sales for a user that are pending and have not been paid out
    return [...this.salesDB.values()].filter(sale =>
      sale.userId === userId && sale.status === SaleStatus.PENDING && !sale.advancePayoutGiven
    );
  }

  getApprovedAndDeclinedSales(userId: string): Sale[] { // get all sales for a user that are approved or declined
    return [...this.salesDB.values()].filter(sale =>
      sale.userId === userId && (sale.status === SaleStatus.APPROVED || sale.status === SaleStatus.DECLINED)
    );
  }
}
