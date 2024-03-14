import { getDocs, collection } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Allocation } from "./models"

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