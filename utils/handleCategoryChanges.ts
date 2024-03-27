import { MovedSubcategoryMap } from "@/features/edit-categories/edit-page";
import { createCategory } from "@/firebase/categories";
import { Category, Subcategory } from "@/firebase/models";

export function handleCategoryChanges(userID: string, budgetID: string, deletedCategoriesByID: string[], newCategories: Category[], deletedSubcategoriesByID: string[], newSubcategories: Subcategory[], movedSubcategories: MovedSubcategoryMap[]) {
	if (newCategories.length > 0) {
		createCategories(userID, budgetID, newCategories);
	}
}

async function createCategories(userID: string, budgetID: string, newCategories: Category[]) {
	for (const category of newCategories) {
        await createCategory(userID, budgetID, category);
	}
}

function deleteCategories(deletedCategoriesByID: string[]) {
	// Update subcategories - both
	// Update allocations - subcatID
	// Update transactions - both
}
