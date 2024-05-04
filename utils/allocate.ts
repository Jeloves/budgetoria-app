import { createAllocation } from "@/firebase/allocations";
import { Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { v4 as uuidv4 } from "uuid";

export type SubcategoryAllocation = {
	subcategory: Subcategory;
	assignedBalance: number;
	availableBalance: number;
};
export type CategoryAllocation = {
	category: Category;
	totalAssignedBalance: number;
	totalAvailableBalance: number;
	subcategoryAllocations: SubcategoryAllocation[];
};

export function assignAllocations(userID: string, budgetID: string, category: Category, filteredSubcategories: Subcategory[], filteredAllocations: Allocation[], filteredTransactions: Transaction[], year: number, month: number): CategoryAllocation {
	let totalAssignedBalance = 0;
	let totalAvailableBalance = 0;
	const subcategoryAllocations: SubcategoryAllocation[] = [];

	for (const subcategory of filteredSubcategories) {
		// Retrieving the assigned balance for this date
		let targetAllocation = filteredAllocations.find((allocation) => allocation.subcategoryID === subcategory.id);
		// If none are found, creates a new $0.00 allocation;
		if (typeof targetAllocation === "undefined") {
			targetAllocation = new Allocation(uuidv4(), year, month, 0, subcategory.id);
			createAllocation(userID, budgetID, targetAllocation);
		}
		const assignedBalance = targetAllocation.balance;

		// Calculating the available balance
		let availableBalance = targetAllocation.balance;
		// Filtering transactions for this subcategory only
		const subcategoryFilteredTransactions = filteredTransactions.filter((transaction) => transaction.subcategoryID === subcategory.id);
		// Adding or subtracting transaction balances from the available balance
		for (const transaction of subcategoryFilteredTransactions) {
			transaction.outflow ? (availableBalance -= transaction.balance) : (availableBalance += transaction.balance);
		}

		// Updating total balances
		totalAssignedBalance += assignedBalance;
		totalAvailableBalance += availableBalance;

		subcategoryAllocations.push(
			{
				subcategory: subcategory,
				assignedBalance: assignedBalance,
				availableBalance: availableBalance,
			}
		)
	}

	return {
		category: category,
		totalAssignedBalance: totalAssignedBalance,
		totalAvailableBalance: totalAvailableBalance,
		subcategoryAllocations: subcategoryAllocations,
	};
}
