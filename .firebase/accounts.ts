import { getDocs, collection, doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { firestore, collectionLabel } from "./firebase.config";
import { Account } from "./models";

export async function getAccounts(userID: string, budgetID: string): Promise<Account[]> {
	try {
		const accountsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.accounts));

		const accounts: Account[] = accountsSnapshot.docs.map((doc) => {
			const data = doc.data();
			return new Account(doc.id, data.name, data.date, data.initialBalance, data.balance);
		});

		return accounts;
	} catch (error) {
		console.error("Failed to read accounts.", error);
        throw error;
	}
}

export async function createAccount(userID: string, budgetID: string, newAccount: Account) {
	try {
		const accountRef = doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.accounts, newAccount.id);
		await setDoc(accountRef, {
			name: newAccount.name,
			date: newAccount.date,
			initialBalance: newAccount.initialBalance,
			balance: newAccount.balance,
		});
	} catch (error) {
		console.error("Failed to create account.", error);
	}
}

export async function deleteAccount(userID: string, budgetID: string, accountID: string) {
	try {
		await deleteDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.accounts, accountID));
	} catch (error) {
		console.error("Failed to delete account", error);
	}
}

export async function updateAccountBalance(userID: string, budgetID: string, accountID: string, changeInBalance: number) {
	try {
		const accountRef = doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.accounts, accountID);
		const accountSnapshot = await getDoc(accountRef);

		if (accountSnapshot) {
			const data = accountSnapshot.data();
			if (data) {
				updateDoc(accountRef, {
					balance: data.balance + changeInBalance,
				});
			} else {
				throw new Error("Transaction data does not exist.");
			}
		} else {
			throw new Error("Transaction snapshot does not exist.");
		}
	} catch (error) {
		console.error("Failed to update account balance: ", error);
		throw error;
	}
}