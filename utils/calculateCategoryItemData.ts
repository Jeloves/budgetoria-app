import { Category, Subcategory, Allocation, Transaction } from "@/firebase/models";

interface CategoryItemDataMap {
	categoryAssignedBalance: number;
	categoryAvailableBalance: number;
	subcategoryAllocations: SubcategoryAllocationsMap[];
}

interface SubcategoryAllocationsMap {
	subcategoryID: string;
	subcategoryAssignedBalance: number;
	subcategoryAvailableBalance: number;
}

export function calculateCategoryItemData(subcategories: Subcategory[], allocations: Allocation[], transactions: Transaction[]): CategoryItemDataMap {
	let totalAssignedBalance = 0;
	let totalAvailableBalance = 0;
	const subcategoryAllocationMapObjects: SubcategoryAllocationsMap[] = [];

	for (let i = 0; i < subcategories.length; i++) {
		const subcategory = subcategories[i];

		// Filtering transactions for this subcategory
		const filteredTransactions = transactions.filter((transaction) => {
			return transaction.subcategoryID === subcategory.id;
		});

		// Calculating assigned allocation for this subcategory.
		const subcategoryAssignedAllocation: Allocation | undefined = allocations.find((allocation) => {
			return allocation.subcategoryID === subcategory.id;
		});
		const subcategoryAssignedBalance = subcategoryAssignedAllocation ? subcategoryAssignedAllocation.balance : 0;

		// Calculating available allocation for this subcategory.
		let subcategoryAvailableBalance = subcategoryAssignedBalance;
		for (const transaction of filteredTransactions) {
			transaction.outflow ? (subcategoryAvailableBalance -= transaction.balance) : (subcategoryAvailableBalance += transaction.balance);
		}

		// Updating CategoryItem data.
		subcategoryAllocationMapObjects.push({ subcategoryID: subcategory.id, subcategoryAssignedBalance: subcategoryAssignedBalance, subcategoryAvailableBalance: subcategoryAvailableBalance });
		totalAssignedBalance += subcategoryAssignedBalance;
		totalAvailableBalance += subcategoryAvailableBalance;
	}

	return { categoryAssignedBalance: totalAssignedBalance, categoryAvailableBalance: totalAvailableBalance, subcategoryAllocations: subcategoryAllocationMapObjects };
}
