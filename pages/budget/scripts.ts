import { NIL as NIL_UUID } from "uuid";
import { Allocation, Category, Transaction } from "@/firebase/models";

// Calculates allocation data at start, or when dateDisplayed is changed.
export function assignAllocations(categories: Category[], allocations: Allocation[], transactions: Transaction[], month: number, year: number) {
	// Filters transactions for that month
	const filteredTransactionsByMonthYear: Transaction[] = transactions.filter((transaction) => {
		const timestamp = transaction.date;
		const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
		const date = new Date(milliseconds);
		return date.getMonth() === month && date.getFullYear() === year;
	});

	const filteredAllocationsByMonthYear: Allocation[] = allocations.filter((allocation) => {
		return allocation.month === month && allocation.year === year;
	});

	for (const category of categories) {
		if (category.id === NIL_UUID) {
			continue;
		}
		category.assigned = 0;
		category.available = 0;
		for (const subcategory of category.subcategories) {
			subcategory.assigned = 0;
			subcategory.available = 0;

			// Filters allocations & transactions for specific subcategory
			const filteredAllocationsBySubcategoryID = filteredAllocationsByMonthYear.filter((allocation) => {
				return allocation.subcategoryID === subcategory.id;
			});
			const filteredTransactionsBySubcategoryID = filteredTransactionsByMonthYear.filter((transaction) => {
				return transaction.subcategoryID === subcategory.id;
			});
			for (const allocation of filteredAllocationsBySubcategoryID) {
				// Assigned values = displayed month's allocation
				subcategory.assigned = allocation.balance;
				category.assigned += allocation.balance;

				// Available values = Assigned values - transactions for that month
				category.available += allocation.balance;
				subcategory.available = allocation.balance;
				for (const transaction of filteredTransactionsBySubcategoryID) {
					subcategory.available += transaction.balance;
					category.available += transaction.balance;
				}
			}
		}
	}
}
