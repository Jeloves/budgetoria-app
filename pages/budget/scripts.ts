import { Allocation, Category, Subcategory } from "@/firebase/models";

export function assignAllocations(categories: Category[], allocations: Allocation[], month: number, year: number) {
	for (const category of categories) {
        if (category.id === "00000000-0000-0000-0000-000000000000") {
            continue;
        }
		for (const subcategory of category.subcategories) {
			for (const allocation of allocations) {
                if (allocation.month !== month || allocation.year !== year) {
                    continue;
                }
                if (subcategory.id === allocation.subcategoryID) {
                    subcategory.assigned = allocation.balance;
                    category.assigned += allocation.balance;
                }
			}
		}
	}
}
