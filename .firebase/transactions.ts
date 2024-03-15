import { getDocs, collection } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Transaction } from "./models"

export async function getTransactions(userID: string, budgetID: string): Promise<Transaction[]> {
	try {
		const transactionsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions));

		const transactions: Transaction[] = transactionsSnapshot.docs.map((doc) => {
			const data = doc.data();
			return { ...data, id: doc.id } as Transaction;
		});

		return transactions;
	} catch (error) {
		console.error("Failed to read transactions: ", error);
		throw error;
	}
}