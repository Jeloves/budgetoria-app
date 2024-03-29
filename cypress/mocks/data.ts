import { Account, Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export function getMockCategories(): Category[] {
	return [new Category("categoryID1", "Test Category 1"), new Category("categoryID2", "Test Category 2"), new Category("categoryID3", "Test Category 3"), new Category("categoryID4", "Test Category 4")];
}

export function getMockSubcategories(): Subcategory[] {
	return [
		new Subcategory("subcategoryID1A", "Test Subcategory 1A", "categoryID1"),
		new Subcategory("subcategoryID2A", "Test Subcategory 2A", "categoryID1"),
		new Subcategory("subcategoryID3A", "Test Subcategory 3A", "categoryID1"),
		new Subcategory("subcategoryID4A", "Test Subcategory 4A", "categoryID1"),

		new Subcategory("subcategoryID1B", "Test Subcategory 1B", "categoryID2"),
		new Subcategory("subcategoryID2B", "Test Subcategory 2B", "categoryID2"),
		new Subcategory("subcategoryID3B", "Test Subcategory 3B", "categoryID2"),
		new Subcategory("subcategoryID4B", "Test Subcategory 4B", "categoryID2"),

		new Subcategory("subcategoryID1C", "Test Subcategory 1C", "categoryID3"),
		new Subcategory("subcategoryID2C", "Test Subcategory 2C", "categoryID3"),
		new Subcategory("subcategoryID3C", "Test Subcategory 3C", "categoryID3"),
		new Subcategory("subcategoryID4C", "Test Subcategory 4C", "categoryID3"),

		new Subcategory("subcategoryID1D", "Test Subcategory 1D", "categoryID4"),
		new Subcategory("subcategoryID2D", "Test Subcategory 2D", "categoryID4"),
		new Subcategory("subcategoryID3D", "Test Subcategory 3D", "categoryID4"),
		new Subcategory("subcategoryID4D", "Test Subcategory 4D", "categoryID4"),
	];
}

export function getMockAllocations(): Allocation[] {
	return [
		new Allocation("allocationID1A", 2024, 0, 0, "subcategoryID1A"),
		new Allocation("allocationID2A", 2024, 0, 2000000, "subcategoryID2A"),
		new Allocation("allocationID3A", 2024, 0, 15770000, "subcategoryID3A"),
		new Allocation("allocationID4A", 2024, 0, 20000000000, "subcategoryID4A"),

		new Allocation("allocationID1B", 2024, 0, 0, "subcategoryID1B"),
		new Allocation("allocationID2B", 2024, 0, 2000000, "subcategoryID2B"),
		new Allocation("allocationID3B", 2024, 0, 15770000, "subcategoryID3B"),
		new Allocation("allocationID4B", 2024, 0, 20000000000, "subcategoryID4B"),

		new Allocation("allocationID1C", 2024, 0, 0, "subcategoryID1C"),
		new Allocation("allocationID2C", 2024, 0, 2000000, "subcategoryID2C"),
		new Allocation("allocationID3C", 2024, 0, 15770000, "subcategoryID3C"),
		new Allocation("allocationID4C", 2024, 0, 20000000000, "subcategoryID4C"),

		new Allocation("allocationID1D", 2024, 0, 0, "subcategoryID1D"),
		new Allocation("allocationID2D", 2024, 0, 2000000, "subcategoryID2D"),
		new Allocation("allocationID3D", 2024, 0, 15770000, "subcategoryID3D"),
		new Allocation("allocationID4D", 2024, 0, 20000000000, "subcategoryID4D"),
	];
}

export function getMockTransactions(): Transaction[] {
	const timestamp = new Timestamp(1704114488, 745000000); // Jan 1, 2024 at 8:08:08AM UTC-5
	const template = new Transaction("transactionID", timestamp, "payee", "memo", true, 0, true, "accountID1", "categoryID", "subcategoryID");
	return [
		new Transaction("transactionID1", timestamp, "payee", "memo", true, 100000000, true, "accountID1", "categoryID1", "subcategoryID1A"),
		new Transaction("transactionID2", timestamp, "payee", "memo", false, 100000000, true, "accountID1", "categoryID1", "subcategoryID2A"),

		new Transaction("transactionID3", timestamp, "payee", "memo", true, 100000000, true, "accountID1", "categoryID2", "subcategoryID1B"),
		new Transaction("transactionID4", timestamp, "payee", "memo", false, 100000000, true, "accountID1", "categoryID2", "subcategoryID2B"),

		new Transaction("transactionID5", timestamp, "payee", "memo", true, 100000000, true, "accountID2", "categoryID3", "subcategoryID1C"),
		new Transaction("transactionID6", timestamp, "payee", "memo", false, 100000000, true, "accountID2", "categoryID3", "subcategoryID2C"),

		new Transaction("transactionID7", timestamp, "payee", "memo", true, 100000000, true, "accountID2", "categoryID4", "subcategoryID1D"),
		new Transaction("transactionID8", timestamp, "payee", "memo", false, 100000000, true, "accountID2", "categoryID4", "subcategoryID2D"),
	];
}

export function getMockAccounts(): Account[] {
	return [new Account("accountID1", "Account 1", 1000000000, 1000000000), new Account("accountID2", "Account 2", 3000000000, 3000000000)];
}
