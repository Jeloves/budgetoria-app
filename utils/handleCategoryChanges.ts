import { MovedSubcategoryMap } from "@/features/edit-categories/edit-page";
import { createCategory, createSubcategory } from "@/firebase/categories";
import { Category, Subcategory } from "@/firebase/models";

export function handleCategoryChanges(userID: string, budgetID: string, deletedCategoriesByID: string[], newCategories: Category[], deletedSubcategoriesByID: string[], newSubcategories: Subcategory[], movedSubcategories: MovedSubcategoryMap[]) {
	if (newCategories.length > 0) {
		createCategories(userID, budgetID, newCategories);
	}

	if (newSubcategories.length > 0) {
		createSubcategories(userID, budgetID, newSubcategories);
	}
}

async function createCategories(userID: string, budgetID: string, newCategories: Category[]) {
	for (const category of newCategories) {
        await createCategory(userID, budgetID, category);
	}
}

async function createSubcategories(userID: string, budgetID: string, newSubcategories: Subcategory[]) {
	for (const subcategory of newSubcategories) {
		await createSubcategory(userID, budgetID, subcategory);
	}
}

function deleteCategories(deletedCategoriesByID: string[]) {
	// Update subcategories - both
	// Update allocations - subcatID
	// Update transactions - both
}
