import { getDocs, collection } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Budget } from "./models"

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
			const data = doc.data();
			return data.selectedBool;
		});
		
		if (budgetDoc) {
			return { ...budgetDoc.data(), id: budgetDoc.id } as Budget;
		} else {
			throw new Error("Cannot find a selected budget.");
		}
	} catch (error) {
		console.error("Failed to read selected budget: ", error);
		throw error;
	}
}
