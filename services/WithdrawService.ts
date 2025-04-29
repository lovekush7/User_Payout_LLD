import { Withdraw } from "../Models/Withdraw";

export class WithdrawService {
  constructor(private withdrawDB: Map<string, Withdraw>) {}

  createWithdraw(withdraw: Withdraw) {
    this.withdrawDB.set(withdraw.withdrawId, withdraw);
  }
}