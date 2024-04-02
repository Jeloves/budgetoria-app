import { getDocs, collection, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { firestore, collectionLabel } from "./firebase.config";
import { Account } from "./models";

export async function getAccounts(userID: string, budgetID: string): Promise<Account[]> {
	try {
		const accountsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.accounts));

		const accounts: Account[] = accountsSnapshot.docs.map((doc) => {
			const data = doc.data();
			return new Account(doc.id, data.name, data.initialBalance, data.balance);
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
			initialBalance: newAccount.initialBalance,
			balance: newAccount.balance,
		});
	} catch (error) {
		console.error("Failed to create account.", error);
	}
}
