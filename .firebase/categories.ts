import { getDocs, collection } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Category, Subcategory } from "./models"

export async function getCategories(userID: string, budgetID: string): Promise<Category[]> {
	try {
		const categoriesSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.categories));

		const categories: Category[] = categoriesSnapshot.docs.map((doc) => {
			const data = doc.data();
			return new Category(doc.id, data.name);
		});

		return categories;
	} catch (error) {
		console.error("Failed to read categories: ", error);
		throw error;
	}
}

export async function getSubcategories(userID: string, budgetID: string): Promise<Subcategory[]> {
	try {
		const subcategoriesSnapshot = await getDocs(collection(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.subcategories));

		const subcategories: Subcategory[] = subcategoriesSnapshot.docs.map((doc) => {
			const data = doc.data();
			return new Subcategory(doc.id, data.name, data.categoryID);
		});

		return subcategories;
	} catch (error) {
		console.error("Failed to read subcategories: ", error);
		throw error;
	}
}