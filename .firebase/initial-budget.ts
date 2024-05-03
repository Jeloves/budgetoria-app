import { Timestamp, doc, setDoc } from "firebase/firestore";
import { collectionLabel } from "./firebase.config";
import { firestore } from "./firebase.config";
import { Budget, Category, Subcategory } from "./models";
import { v4 as uuidv4 } from "uuid";

const categories = [new Category(uuidv4(), "Essential"), new Category(uuidv4(), "Nonessential")];

const subcategories = [
	new Subcategory(uuidv4(), "Gas", categories[0].id),
	new Subcategory(uuidv4(), "Electricity", categories[0].id),
	new Subcategory(uuidv4(), "Videogames", categories[1].id),
	new Subcategory(uuidv4(), "Crunchyroll", categories[1].id),
];

export async function createInitialBudget(userID: string) {
	try {
		const budget = new Budget(uuidv4(), "My Budget", Timestamp.fromDate(new Date()), true, 0);
        const userRef = doc(firestore, collectionLabel.users, userID)
		const budgetRef = doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budget.id);
        await setDoc(userRef, {
            emptyField: null,
        })
		await setDoc(budgetRef, {
			name: budget.name,
			dateCreated: budget.dateCreated,
			currency: budget.currency,
			locale: budget.locale,
			selected: budget.selected,
			unassignedBalance: budget.unassignedBalance,
		});
		await createInitialCategories(userID, budget.id);
		await createInitialSubcategories(userID, budget.id);
        console.log("Initial budget data created")
	} catch (error) {
		console.error("Failed to create initial budget: ", error);
	}
}

async function createInitialCategories(userID: string, budgetID: string) {
	try {
		for (const category of categories) {
			await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.categories, category.id), {
				name: category.name,
			});
		}
	} catch (error) {
		console.error("Failed to add initial categories", error);
	}
}

async function createInitialSubcategories(userID: string, budgetID: string) {
	try {
		for (const subcategory of subcategories) {
			await setDoc(doc(firestore, collectionLabel.users, userID, collectionLabel.budgets, budgetID, collectionLabel.subcategories, subcategory.id), {
				name: subcategory.name,
				categoryID: subcategory.categoryID,
			});
		}
	} catch (error) {
		console.error("Failed to add initial subcategories", error);
	}
}
