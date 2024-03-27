import { getDocs, collection, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Allocation } from "./models";
import { updateUnassignedBalance } from "./budgets";

export async function getAllocations(userID: string, budgetID: string): Promise<Allocation[]> {
	try {
		const allocationsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.allocations));

		const allocations: Allocation[] = allocationsSnapshot.docs.map((doc) => {
			const data = doc.data();
			return { ...data, id: doc.id } as Allocation;
		});

		return allocations;
	} catch (error) {
		console.error("Failed to read allocations: ", error);
		throw error;
	}
}

export async function updateAssignedAllocation(userID: string, budgetID: string, subcategoryID: string, month: number, year: number, newBalance: number) {
	try {
		const allocationsSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.allocations));

		let targetAllocationID = "";
		for (const doc of allocationsSnapshot.docs) {
			const data = doc.data();
			if (data.subcategoryID === subcategoryID && data.month === month && data.year === year) {
				targetAllocationID = doc.id;
			} else {
				continue;
			}
		}

		if (targetAllocationID) {
			const allocationRef = doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.allocations, targetAllocationID);
			setDoc(allocationRef, { balance: newBalance }, { merge: true });
		}
	} catch {
		console.error("Failed to update allocation.");
	}
}

export async function deleteAllocation(userID: string, budgetID: string, allocationID: string) {
	try {
		await deleteDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.allocations, allocationID));
	} catch (error) {
		console.error("Failed to delete allocation", error);
	}
}
