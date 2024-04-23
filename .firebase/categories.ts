import { getDocs, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Category, Subcategory } from "./models";

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

export async function createCategory(userID: string, budgetID: string, newCategory: Category) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.categories, newCategory.id), {
			name: newCategory.name,
		});
	} catch (error) {
		console.error("Failed to add new category", error);
	}
}

export async function deleteCategory(userID: string, budgetID: string, categoryID: string) {
	try {
		await deleteDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.categories, categoryID));
	} catch (error) {
		console.error("Failed to delete category", error);
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

export async function createSubcategory(userID: string, budgetID: string, newSubcategory: Subcategory) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.subcategories, newSubcategory.id), {
			name: newSubcategory.name,
			categoryID: newSubcategory.categoryID,
		});
	} catch (error) {
		console.error("Failed to add new subcategory", error);
	}
}

export async function deleteSubcategory(userID: string, budgetID: string, subcategoryID: string) {
	try {
		await deleteDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.subcategories, subcategoryID));
	} catch (error) {
		console.error("Failed to delete subcategory", error);
	}
}

export async function updateSubcategory(userID: string, budgetID: string, subcategory: Subcategory) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.subcategories, subcategory.id), {
			name: subcategory.name,
			categoryID: subcategory.categoryID,
		});
	} catch (error) {
		console.error("Failed to update subcategory", error);
		throw error;
	}
}

export async function updateCategory(userID: string, budgetID: string, category: Category) {
	try {
		await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.categories, category.id), {
			name: category.name,
		});
	} catch (error) {
		console.error("Failed to update category", error);
		throw error;
	}
}
