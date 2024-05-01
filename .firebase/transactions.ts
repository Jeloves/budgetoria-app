import { getDocs, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Transaction } from "./models";

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
export async function getTransactionsByDate(userID: string, budgetID: string, month: number, year: number): Promise<Transaction[]> {
	try {
		const transactionsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions));

		const transactions: Transaction[] = transactionsSnapshot.docs.map((doc) => {
			const data = doc.data();
			return { ...data, id: doc.id } as Transaction;
		});

		const filteredTransactions: Transaction[] = transactions.filter((transaction) => {
			const timestamp = transaction.date;
			const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
			const date = new Date(milliseconds);
			return date.getMonth() === month && date.getFullYear() === year;
		});

		return filteredTransactions;
	} catch (error) {
		console.error("Failed to read transactions by date: ", error);
		throw error;
	}
}

export async function createTransaction(userID: string, budgetID: string, newTransaction: Transaction) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions, newTransaction.id), {
			date: newTransaction.date,
			payee: newTransaction.payee,
			memo: newTransaction.memo,
			outflow: newTransaction.outflow,
			balance: newTransaction.balance,
			approval: newTransaction.approval,
			accountID: newTransaction.accountID,
			categoryID: newTransaction.categoryID,
			subcategoryID: newTransaction.subcategoryID,
		});
	} catch (error) {
		console.error("Failed to add new transaction", error);
	}
}

export async function deleteTransaction(userID: string, budgetID: string, transactionID: string) {
	try {
		await deleteDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions, transactionID));
	} catch (error) {
		console.error("Failed to delete transaction", error);
	}
}

export async function updateTransaction(userID: string, budgetID: string, transaction: Transaction) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions, transaction.id), {
			date: transaction.date,
			payee: transaction.payee,
			memo: transaction.memo,
			outflow: transaction.outflow,
			balance: transaction.balance,
			approval: transaction.approval,
			accountID: transaction.accountID,
			categoryID: transaction.categoryID,
			subcategoryID: transaction.subcategoryID,
		});
	} catch (error) {
		console.error("Failed to update transaction", error);
		throw error;
	}
}
