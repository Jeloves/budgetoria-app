import { getDocs, collection, doc, setDoc } from "firebase/firestore";
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

export async function updateTransaction(userID: string, budgetID: string, transaction: Transaction) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions, transaction.id), {
			date: transaction.date,
			payee: transaction.payee,
			memo: transaction.memo,
			balance: transaction.balance,
			approval: transaction.approval,
			accountID: transaction.accountID,
			categoryID: transaction.categoryID,
			subcategoryID: transaction.subcategoryID
		});
	} catch (error) {
		console.error("Failed to update transaction", error);
		throw error;
	}
}