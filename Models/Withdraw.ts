import { WithdrawStatus } from "./Enums";

export class Withdraw {
  constructor(
    public withdrawId: string,
    public userId: string,
    public amount: number,
    public status: WithdrawStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}