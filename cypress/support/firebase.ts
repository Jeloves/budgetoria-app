import { deleteAccount, getAccounts } from "@/firebase/accounts";
import { createUser } from "@/firebase/auth";
import { firestore, collectionLabel } from "@/firebase/firebase.config";
import { createInitialBudget } from "@/firebase/initial-budget";
import { Account, Budget, Transaction } from "@/firebase/models";
import { deleteTransaction, getTransactions } from "@/firebase/transactions";
import { setDoc, doc, deleteDoc } from "firebase/firestore";

export async function deleteUser(userID: string) {
    try {
		await deleteDoc(doc(firestore, collectionLabel.users, userID));
	} catch (error) {
		console.error("Failed to delete user", error);
	}
}

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

export async function createBudget(userID: string, budget: Budget) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budget.id), {
			name: budget.name,
			dateCreated: budget.dateCreated,
			selected: budget.selected,
			unassignedBalance: budget.unassignedBalance
		});
	} catch (error) {
		console.error("Failed to create test budget", error);
	}
}

export async function createMockUser(email: string, password: string) {
    createUser(email, password).then(
        (userID) => {
            createInitialBudget(userID as string);
        },
        (error) => {
            console.error("Failed to create mock user", error)
        }
    );
}

async function clearFirestoreEmulator() {
    try {
        const response = await fetch('http://127.0.0.1:8080/emulator/v1/projects/budgetoria/databases/(default)/documents', {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error clearing Firestore emulator: ${response.statusText}`);
        }

        console.log('Firestore emulator data cleared.');
    } catch (error) {
        console.error('Failed to clear Firestore emulator:', error);
    }
}
async function clearAuthEmulator() {
    try {
        const response = await fetch('http://127.0.0.1:9099/emulator/v1/projects/budgetoria/accounts', {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error clearing Auth emulator: ${response.statusText}`);
        }

        console.log('Auth emulator data cleared.');
    } catch (error) {
        console.error('Failed to clear Auth emulator:', error);
    }
}
export async function clearEmulators() {
    await clearFirestoreEmulator();
    await clearAuthEmulator();
}