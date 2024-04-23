import { MovedSubcategoryMap } from "@/features/edit-page/edit-page";
import { deleteAllocation } from "@/firebase/allocations";
import { updateUnassignedBalance } from "@/firebase/budgets";
import { createCategory, createSubcategory, deleteCategory, deleteSubcategory, updateSubcategory } from "@/firebase/categories";
import { Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { updateTransaction } from "@/firebase/transactions";
import { EditDataMap } from "@/features/edit-page/edit-page";

export async function handleCategoryChanges(
	userID: string,
	budgetID: string,
	allocations: Allocation[],
	subcategories: Subcategory[],
	transactions: Transaction[],
	newCategories: Category[],
	newSubcategories: Subcategory[],
	deletedCategoryIDs: string[],
	deletedSubcategoryIDs: string[],
	movedSubcategories: MovedSubcategoryMap[],
): Promise<boolean> {
	try {
		if (newCategories.length > 0) {
			await createCategories(userID, budgetID, newCategories);
		}

		if (newSubcategories.length > 0) {
			await createSubcategories(userID, budgetID, newSubcategories);
		}

		if (deletedCategoryIDs.length > 0 || deletedSubcategoryIDs.length > 0) {
			await deleteCategories(userID, budgetID, allocations, transactions, deletedCategoryIDs, deletedSubcategoryIDs);
		}

		if (movedSubcategories.length > 0) {
			await moveSubcategories(userID, budgetID, subcategories, transactions, movedSubcategories);
		}

		return Promise.resolve(true);
	} catch (error) {
		console.error("An error has occurred handling category changes", error);
		return Promise.reject(false);
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

async function deleteCategories(userID: string, budgetID: string, allocations: Allocation[], transactions: Transaction[], deletedCategoriesByID: string[], deletedSubcategoriesByID: string[]) {
	for (const categoryID of deletedCategoriesByID) {
		// Deleting category document
		await deleteCategory(userID, budgetID, categoryID);

		// Updating transaction documents with corresponding category IDs
		const filteredTransactions = transactions.filter((transaction) => {
			return transaction.categoryID === categoryID;
		});
		for (const transaction of filteredTransactions) {
			transaction.categoryID = "";
			transaction.subcategoryID = "";
			transaction.approval = false;
			await updateTransaction(userID, budgetID, transaction);
		}
	}

	// Deleting subcategory documents
	for (const subcategoryID of deletedSubcategoriesByID) {
		await deleteSubcategory(userID, budgetID, subcategoryID);

		// Updating transaction documents with corresponding subcategory IDs
		const filteredTransactions = transactions.filter((transaction) => {
			return transaction.subcategoryID === subcategoryID;
		});
		for (const transaction of filteredTransactions) {
			transaction.categoryID = "";
			transaction.subcategoryID = "";
			transaction.approval = false;
			await updateTransaction(userID, budgetID, transaction);
		}

		// Deleting allocation documents
		const filteredAllocations = allocations.filter((allocation) => {
			return allocation.subcategoryID === subcategoryID;
		});
		for (const allocation of filteredAllocations) {
			await deleteAllocation(userID, budgetID, allocation.id);
			await updateUnassignedBalance(userID, allocation.balance);
		}
	}
}

async function moveSubcategories(userID: string, budgetID: string, subcategories: Subcategory[], transactions: Transaction[], movedSubcategories: MovedSubcategoryMap[]) {
	// Updating subcategory documents' categoryIDs
	for (let map of movedSubcategories) {
		const filteredSubcategories = subcategories.filter((subcategory) => subcategory.id === map.subcategoryID)
		const updatedSubcategory = filteredSubcategories[0];
		updatedSubcategory.categoryID = map.newCategoryID;
		await updateSubcategory(userID, budgetID, updatedSubcategory);

		// Updating transaction documents' categoryIDs
		const filteredTransactions = transactions.filter((transaction) => {
			return transaction.subcategoryID === map.subcategoryID;
		});
		for (let transaction of filteredTransactions) {
			transaction.categoryID = map.newCategoryID;
			await updateTransaction(userID, budgetID, transaction);
		}
	}
}
