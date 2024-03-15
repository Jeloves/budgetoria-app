import { Allocation, Category, Transaction } from "@/firebase/models";

export function assignAllocations(categories: Category[], allocations: Allocation[], transactions: Transaction[], month: number, year: number) {
	const filteredTransactions: Transaction[] = [];
	for (const transaction of transactions) {
		const timestamp = transaction.date;
		const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
		const date = new Date(milliseconds);
		if (date.getMonth() === month && date.getFullYear() === year) {
			filteredTransactions.push(transaction);
		}
	}

	for (const category of categories) {
		if (category.id === "00000000-0000-0000-0000-000000000000") {
			continue;
		}
		category.assigned = 0;
		category.available = 0;
		for (const subcategory of category.subcategories) {
			subcategory.assigned = 0;
			subcategory.available = 0;
			for (const allocation of allocations) {
				if (allocation.month !== month || allocation.year !== year) {
					continue;
				}
				if (subcategory.id === allocation.subcategoryID) {
					subcategory.assigned = allocation.balance;
					subcategory.available = allocation.balance;
					category.assigned += allocation.balance;
					category.available += allocation.balance;

					for (const transaction of filteredTransactions) {
						if (transaction.subcategoryID === subcategory.id) {
							subcategory.available += transaction.balance;
							category.available += transaction.balance;
						}
					}
				}
			}
		}
	}
}
