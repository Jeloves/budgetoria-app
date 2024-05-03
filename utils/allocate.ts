import { Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { v4 as uuidv4 } from "uuid";

export type SubcategoryAllocation = {
	subcategory: Subcategory;
	assignedBalance: number;
	availableBalance: number;
};
export type CategoryAllocations = {
	category: Category;
	totalAssignedBalance: number;
	totalAvailableBalance: number;
	subcategoryAllocations: SubcategoryAllocation[];
};

export function assignAllocations(category: Category, filteredSubcategories: Subcategory[], filteredAllocations: Allocation[], filteredTransactions: Transaction[], year: number, month: number): CategoryAllocations {

	let totalAssignedBalance = 0;
	let totalAvailableBalance = 0;
	const subcategoryAllocations: SubcategoryAllocation[] = [];

	for (const subcategory of filteredSubcategories) {
		// Finds the single corresponding allocation for the date
		let targetAllocation = filteredAllocations.find(allocation => allocation.subcategoryID === subcategory.id);
		// If none are found, creates a new $0.00 allocation;
		if (typeof targetAllocation === "undefined") {
			targetAllocation = new Allocation(uuidv4(), year, month, 0, subcategory.id)
		}

	}

	return {
		category: category,
		totalAssignedBalance: totalAssignedBalance,
		totalAvailableBalance: totalAvailableBalance,
		subcategoryAllocations: subcategoryAllocations,
	};
}
