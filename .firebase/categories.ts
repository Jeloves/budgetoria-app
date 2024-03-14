import { getDocs, collection } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Category } from "./models"

export async function getCategories(userID: string, budgetID: string): Promise<Category[]> {
	try {
		const categoriesSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.categories));

		const categories: Category[] = categoriesSnapshot.docs.map((doc) => {
			const data = doc.data();
			return { ...data, id: doc.id } as Category;
		});

		return categories;
	} catch (error) {
		console.error("Failed to read categories: ", error);
		throw error;
	}
}