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
			const timestamp = transaction.timestamp;
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

export async function getTransactionsBySubcategory(userID: string, budgetID: string, subcategoryID: string, month: number, year: number): Promise<Transaction[]> {
	try {
		// Retrieving transaction documents
		const transactionsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions));

		// Filters transactions by subcategoryID and date
		const filteredTransactions: Transaction[] = [];
		transactionsSnapshot.forEach((doc) => {
			const data = doc.data();
			const timestamp = data.date;
			const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
			const date = new Date(milliseconds);
			const isCorrectDate = date.getMonth() === month && date.getFullYear() === year;

			if (data.subcategoryID === subcategoryID && isCorrectDate) {
				filteredTransactions.push(new Transaction(doc.id, data.date, data.payee, data.memo, data.outflow, data.balance, data.approval, data.accountID, data.categoryID, data.subcategoryID));
			}
		});

		return filteredTransactions;
	} catch (error) {
		console.error("Failed to read transactions by subcategory: ", error);
		throw error;
	}
}

export async function getTransactionsByAccount(userID: string, budgetID: string, accountID: string): Promise<Transaction[]> {
	try {
		// Retrieving transaction documents
		const transactionsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions));

		// Filters transactions by accountID
		const filteredTransactions: Transaction[] = [];
		transactionsSnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.accountID === accountID) {
				filteredTransactions.push(new Transaction(doc.id, data.date, data.payee, data.memo, data.outflow, data.balance, data.approval, data.accountID, data.categoryID, data.subcategoryID));
			}
		});

		return filteredTransactions;
	} catch (error) {
		console.error("Failed to read transactions by account: ", error);
		throw error;
	}
}

export async function getUnfinishedTransactions(userID: string, budgetID: string): Promise<Transaction[]> {
	try {
		// Retrieving transaction documents
		const transactionsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions));

		// Filters transactions without a selected payee, account, category, or subcategory
		const filteredTransactions: Transaction[] = [];
		transactionsSnapshot.forEach((doc) => {
			const data = doc.data();
			const isUnfinished = data.accountID === "" || data.payee === "" || data.categoryID === "" || data.subcategory === "";
			if (isUnfinished) {
				filteredTransactions.push(new Transaction(doc.id, data.date, data.payee, data.memo, data.outflow, data.balance, data.approval, data.accountID, data.categoryID, data.subcategoryID));
			}
		});

		return filteredTransactions;
	} catch (error) {
		console.error("Failed to read unfinished transactions: ", error);
		throw error;
	}
}

export async function createTransaction(userID: string, budgetID: string, newTransaction: Transaction) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.transactions, newTransaction.id), {
			date: newTransaction.timestamp,
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
			date: transaction.timestamp,
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
