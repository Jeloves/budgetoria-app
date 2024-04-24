import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { firestore, collectionLabel } from "./firebase.config";
import { v4 as uuidv4 } from "uuid";

export async function getPayees(userID: string, budgetID: string) {
	try {
		const payeesSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.payees));

		const payees: string[] = payeesSnapshot.docs.map((doc) => {
			const data = doc.data();
			return data.name;
		});

		return payees;
	} catch (error) {
		console.error("Failed to read payees", error);
		throw error;
	}
}

export async function createPayee(userID: string, budgetID: string, newPayee: string) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.payees, uuidv4()), {
			name: newPayee,
		});
	} catch (error) {
		console.error("Failed to add new payee", error);
	}
}
