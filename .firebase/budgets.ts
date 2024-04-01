import { getDocs, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Budget } from "./models";
import { v4 as uuidv4 } from "uuid";

export async function getBudgets(userID: string): Promise<Budget[]> {
	try {
		const budgetsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets));

		const budgets: Budget[] = budgetsSnapshot.docs.map((doc) => {
			const data = doc.data();
			return { ...data, id: doc.id } as Budget;
		});

		return budgets;
	} catch (error) {
		console.error("Failed to read user budgets: ", error);
		throw error;
	}
}

export async function getSelectedBudget(userID: string): Promise<Budget> {
	try {
		const budgetsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets));

		const budgetDoc = budgetsSnapshot.docs.find((doc) => {
			return doc.data().selected;
		});

		if (budgetDoc) {
			const data = budgetDoc.data();
			return new Budget(budgetDoc.id, data.name, data.dateCreated, data.locale, data.currency, data.selected, data.unassignedBalance);
		} else {
			throw new Error("Cannot find a selected budget.");
		}
	} catch (error) {
		console.error("Failed to read selected budget: ", error);
		throw error;
	}
}

export async function getUnassignedBalance(userID: string, budgetID: string): Promise<number> {
	try {
		const budgetRef = doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID);
		const budgetSnapshot = await getDoc(budgetRef);
		if (budgetSnapshot.exists()) {
			return budgetSnapshot.data().unassignedBalance;
		} else {
			throw new Error("Budget snapshot does not exist.");
		}
	} catch (error) {
		console.error("Failed to read unassigned balance: ", error);
		throw error;
	}
}

export async function updateUnassignedBalance(userID: string, changeInBalance: number) {
	try {
		const budgetsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets));
		const budgetDoc = budgetsSnapshot.docs.find((doc) => {
			const data = doc.data();
			return data.selected;
		});

		if (budgetDoc) {
			const unassignedBalance = budgetDoc.data().unassignedBalance;
			const budgetRef = doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetDoc.id);
			updateDoc(budgetRef, { unassignedBalance: unassignedBalance + changeInBalance });
		} else {
			throw new Error("Cannot find a selected budget.");
		}
	} catch (error) {
		console.error("Failed to update unassigned balance: ", error);
		throw error;
	}
}

