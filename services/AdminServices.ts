import { SalesService } from "./salesServices";
import { SaleStatus } from "../Models/Enums";

export class AdminService {
    constructor(private salesService: SalesService) {}
  
    reconcileSale(saleId: string, newStatus: SaleStatus) {
      this.salesService.reconcileSale(saleId, newStatus);
    }
  }
  