import { User } from "../Models/User";
import { Sale } from "../Models/Sale";
import { Payout } from "../Models/Payout"
import { SalesService } from './salesServices';
import { PayoutService } from './PayoutService';

export class UserService {
    constructor(private usersDB: Map<string, User>) {}

    getUser(userId: string): User {
        return this.usersDB.get(userId)!;
    }

    getSales(userId: string): Sale[] {
        return new SalesService(new Map<string, Sale>()).getSales(userId);
    }

    getPayouts(userId: string): Payout[] {
        return new PayoutService(new Map<string, Payout>(), new Map<string, User>(), new Map<string, Sale>()).getPayouts(userId);
    }
}