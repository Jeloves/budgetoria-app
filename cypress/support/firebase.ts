import { deleteAccount, getAccounts } from "@/firebase/accounts";
import { Account, Transaction } from "@/firebase/models";
import { deleteTransaction, getTransactions } from "@/firebase/transactions";

export async function clearAccountsAndTransactions(userID: string, budgetID: string) {
    try {
        const accounts: Account[] = await getAccounts(userID, budgetID);
        const transactions: Transaction[] = await getTransactions(userID, budgetID);

        // Array to hold all promises
        let promises = [];

        // Loop to delete accounts
        for (let account of accounts) {
            promises.push(deleteAccount(userID, budgetID, account.id));
        }

        // Loop to delete transactions
        for (let transaction of transactions) {
            promises.push(deleteTransaction(userID, budgetID, transaction.id));
        }

        // Wait for all promises to resolve
        await Promise.all(promises);

        console.log("All accounts and transactions deleted successfully.");
    } catch (error) {
        console.error("Error deleting accounts and transactions:", error);
    }
}

