import { Account, Category, Subcategory } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";

export function getCategoryNameByID(targetID: string, categories: Category[]): string {
	if (targetID === NIL_UUID) {
		return "Unassigned";
	} else {
		const targetCategory = categories.find((category) => category.id === targetID);
		return targetCategory ? targetCategory!.name : "";
	}
}

export function getCategoryNameBySubcategoryID(targetSubcategoryID: string, categories: Category[], subcategories: Subcategory[]): string {
	if (targetSubcategoryID === NIL_UUID) {
		return "Unassigned";
	} else {
		const targetSubcategory = subcategories.find((subcategory) => subcategory.id === targetSubcategoryID);

		if (targetSubcategory) {
			const targetCategory = categories.find((category) => category.id === targetSubcategory.categoryID);
			return targetCategory ? targetCategory!.name : "";
		} else {
			return "";
		}
	}
}

export function getSubcategoryNameByID(targetID: string, subcategories: Subcategory[]): string {
	if (targetID === NIL_UUID) {
		return "Ready to Assign";
	} else {
		const targetSubcategory = subcategories.find((subcategory) => subcategory.id === targetID);
		return targetSubcategory ? targetSubcategory!.name : "";
	}
}

export function getAccountNameByID(targetID: string, accounts: Account[]): string {
	const targetAccount = accounts.find((account) => account.id === targetID);
	return targetAccount ? targetAccount!.name : "";
}
