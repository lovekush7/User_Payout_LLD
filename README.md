# User Payout LLD

## 1. Functional Requirements:

### Advance Payout:
- Calculate and provide 10% of pending sales earnings to users as an advance payout.

### Reconciliation:
- Admin reconciles the sales. Sales can move from "pending" to "approved" or "declined".

### Final Earnings Calculation:
- After reconciliation, calculate the final approved earnings, considering the advance payout already given.

### Payout Reversal:
- If a payout is canceled or rejected by the payout partner, credit the amount back to the user’s account for future withdrawal.

## 2. Break Down the System into Components
We can break the system into the following key components:

### Sales Management:
- Manages sales records, keeps track of the status (`pending`, `approved`, `declined`).

### Payout Management:
- Handles advance payouts, final payouts, and adjustments based on reconciliation.

### User Management:
- Keeps track of users, including their total earnings, advance payouts, and approved earnings.

### Admin Management:
- Allows admins to reconcile sales, update statuses, and monitor payouts (optional).

### Payout Partner Integration:
- Handles communication with the payout partner and tracks the status of payouts (`successful`, `canceled`, or `rejected`).

### Notifications & Alerts (optional):
- Sends notifications to users and admins about payout status, reconciliations, or issues.

## 3. Design Data Models
Here’s how we can structure the data using tables (or equivalent data structures):

### a. Sales Table (sales):
This table stores the sales data and keeps track of the status and earnings for each sale.

| Field               | Type        | Description                                 |
|---------------------|-------------|---------------------------------------------|
| `saleId`            | String      | Unique sale identifier                      |
| `userId`            | String      | User associated with the sale               |
| `brand`             | String      | Brand associated with the sale              |
| `status`            | String      | Status of the sale (`pending`, `approved`, `declined`) |
| `earning`           | Float       | Earnings from the sale                      |
| `advancePayoutGiven`| Boolean     | Whether advance payout was given            |

### b. Payout Table (payouts):
This table stores payout data for each user.

| Field         | Type        | Description                                 |
|---------------|-------------|---------------------------------------------|
| `payoutId`    | String      | Unique payout identifier                    |
| `userId`      | String      | User associated with the payout             |
| `amount`      | Float       | Amount of the payout                        |
| `status`      | String      | Status of the payout (`pending`, `completed`, `cancelled`) |
| `date`        | DateTime    | Date of payout                             |

### c. User Table (users):
This table stores user-related information.

| Field            | Type    | Description                           |
|------------------|---------|---------------------------------------|
| `userId`         | String  | Unique user identifier                |
| `totalEarnings`  | Float   | Total earnings from approved sales    |
| `totalAdvancePayout` | Float | Total advance payout given to the user |

### d. Brand Table (brands):
Stores details for each brand.

| Field    | Type   | Description             |
|----------|--------|-------------------------|
| `brandId`| String | Unique brand identifier |
| `brand`  | String | Brand name              |

## 4. Define APIs and Interfaces

### 1. Sales API:
- **POST /sales**: Create a new sale entry (for initial state).
- **GET /sales/{saleId}**: Fetch details of a specific sale.
- **PUT /sales/{saleId}/updateStatus**: Update the status of the sale (`pending` → `approved`/`declined`).
- **GET /sales/{userId}**: Fetch details of a user's sales.

### 2. Payout API:
- **POST /payouts**: Request a new payout based on sales.
- **GET /payouts/{userId}**: Get payout details for a user.
- **PUT /payouts/{payoutId}/updateStatus**: Update payout status (`pending` → `completed`/`cancelled`).

### 3. User API:
- **GET /users/{userId}/earnings**: Get total approved earnings and advance payout balance.
- **PUT /users/{userId}/adjustBalance**: Adjust the user’s balance when a payout is canceled or refunded.

## 5. Component Interaction

### Example Sequence for Advance Payout Calculation:

1. **Sale Entry Created**:
   - A sale is created with a status of "pending" and an earning amount (e.g., 50).
   - 10% advance payout (5) is calculated and stored in the payouts table.
   - The status of the sale is pending, and `advancePayoutGiven` is set to `true`.

2. **Admin Reconciliation**:
   - Admin updates the sale status to approved or declined.
   - If the status is approved, the system calculates the remaining balance (after deducting the 10% advance payout).
   - If the status is declined, the system subtracts the advance payout from the final approved balance.

3. **Final Payout**:
   - Once the reconciliation is complete, the system computes the final approved balance for the user.
   - The user is paid out the final approved amount, minus any advance payouts already made.

### Example Sequence for Payout Reversal:

1. **Payout Cancellation**:
   - If a payout is canceled or rejected by the payout partner, the system reverses the payout by adding the amount back to the user's `totalEarnings` balance.

2. **User Withdrawal**:
   - After cancellation, the user can re-request the payout.


