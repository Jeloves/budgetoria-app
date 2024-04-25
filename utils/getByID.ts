import { Account, Category, Subcategory } from "@/firebase/models";

export function getCategoryNameByID(targetID: string, categories: Category[]): string {
	const targetCategory = categories.find((category) => category.id === targetID);
	return targetCategory ? targetCategory!.name : "";
}

export function getCategoryNameBySubcategoryID(targetSubcategoryID: string, categories: Category[], subcategories: Subcategory[]): string {
	const targetSubcategory = subcategories.find((subcategory) => subcategory.id === targetSubcategoryID);

	if (targetSubcategory) {
		const targetCategory = categories.find((category) => category.id === targetSubcategory.categoryID);
		return targetCategory ? targetCategory!.name : "";
	} else {
		return "";
	}
}

export function getSubcategoryNameByID(targetID: string, subcategories: Subcategory[]): string {
	const targetSubcategory = subcategories.find((subcategory) => subcategory.id === targetID);
	return targetSubcategory ? targetSubcategory!.name : "";
}

export function getAccountNameByID(targetID: string, accounts: Account[]): string {
	const targetAccount = accounts.find((account) => account.id === targetID);
	return targetAccount ? targetAccount!.name : "";
}
