import { getDocs, collection, doc, updateDoc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Budget } from "./models";

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

export async function createBudget(userID: string, budgetID: string) {
	const newBudget = new Budget(budgetID, "Mock Budget", Timestamp.fromDate(new Date()), true, 0.0);
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, newBudget.id), {
			name: newBudget.name,
			dateCreated: newBudget.dateCreated,
			selected: newBudget.selected,
			unassignedBalance: newBudget.unassignedBalance,
		});
	} catch (error) {
		console.error("Failed to add new budget", error);
	}
}

export async function createTestBudget(userID: string, budget: Budget) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budget.id), {
			name: budget.name,
			dateCreated: budget.dateCreated,
			selected: budget.selected,
			unassignedBalance: budget.unassignedBalance,
		});
	} catch (error) {
		console.error("Failed to create test budget", error);
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
			return new Budget(budgetDoc.id, data.name, data.dateCreated, data.selected, data.unassignedBalance);
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

export async function updateUnassignedBalance(userID: string, budgetID: string, changeInBalance: number) {
	try {
		const budgetRef = doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID);
		const budgetSnapshot = await getDoc(budgetRef);

		if (budgetSnapshot) {
			const data = budgetSnapshot.data();
			if (data) {
				updateDoc(budgetRef, {
					unassignedBalance: data.unassignedBalance + changeInBalance,
				});
			} else {
				throw new Error("Budget data does not exist.");
			}
		} else {
			throw new Error("Budget snapshot does not exist.");
		}
	} catch (error) {
		console.error("Failed to update unassigned balance: ", error);
		throw error;
	}
}
