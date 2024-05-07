// The Array.sort function...
// Unique characters first
// Then numbers (sorted by the left-most digit) For example, [1,11,12,]
// Then letters

import { Account, Category, Subcategory } from "@/firebase/models";
import { Transaction } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";
import { cloneDeep } from "lodash";

export function sortStringsAlphabetically(array: string[]) {
	array.sort((a, b) => {
		const isANumber = !isNaN(parseFloat(a));
		const isBNumber = !isNaN(parseFloat(b));

		if (isANumber && isBNumber) {
			// Both are numbers, compare as numbers
			return parseFloat(a[0]) - parseFloat(b[0]);
		} else if (isANumber) {
			// Only a is a number, place it before b
			return -1;
		} else if (isBNumber) {
			// Only b is a number, place it before a
			return 1;
		} else {
			// Both are non-letter characters or strings, compare as strings
			return a.localeCompare(b);
		}
	});
}

export function sortAccountsAlphabetically(accounts: Account[]) {
	accounts.sort((a, b) => {
		const isANumber = !isNaN(parseFloat(a.name));
		const isBNumber = !isNaN(parseFloat(b.name));

		if (isANumber && isBNumber) {
			// Both are numbers, compare as numbers
			return parseFloat(a.name[0]) - parseFloat(b.name[0]);
		} else if (isANumber) {
			// Only a is a number, place it before b
			return -1;
		} else if (isBNumber) {
			// Only b is a number, place it before a
			return 1;
		} else {
			// Both are non-letter characters or strings, compare as strings
			return a.name.localeCompare(b.name);
		}
	});
}

export function sortCategoriesAlphabetically(categories: Category[]) {
	categories.sort((a, b) => {
		const isANumber = !isNaN(parseFloat(a.name));
		const isBNumber = !isNaN(parseFloat(b.name));

		if (isANumber && isBNumber) {
			// Both are numbers, compare as numbers
			return parseFloat(a.name[0]) - parseFloat(b.name[0]);
		} else if (isANumber) {
			// Only a is a number, place it before b
			return -1;
		} else if (isBNumber) {
			// Only b is a number, place it before a
			return 1;
		} else {
			// Both are non-letter characters or strings, compare as strings
			return a.name.localeCompare(b.name);
		}
	});
}

export function sortSubcategoriesAlphabetically(subcategories: Subcategory[]) {
	subcategories.sort((a, b) => {
		const isANumber = !isNaN(parseFloat(a.name));
		const isBNumber = !isNaN(parseFloat(b.name));

		if (isANumber && isBNumber) {
			// Both are numbers, compare as numbers
			return parseFloat(a.name[0]) - parseFloat(b.name[0]);
		} else if (isANumber) {
			// Only a is a number, place it before b
			return -1;
		} else if (isBNumber) {
			// Only b is a number, place it before a
			return 1;
		} else {
			// Both are non-letter characters or strings, compare as strings
			return a.name.localeCompare(b.name);
		}
	});
}

export function sortTransactionsByTimestamp(transactions: Transaction[]) {
	transactions.sort((a, b) => {
		return b.timestamp.toMillis() - a.timestamp.toMillis();
	});
}

export type DateTransactionsMap = Map<string, Transaction[]> 
export function sortTransactionsIntoTimestampMap(transactions: Transaction[]): DateTransactionsMap {

	// Sorts transactions by timestamp, in descending order (timestamps will never be equal)
	transactions.sort((a, b) => {
		return b.timestamp.toMillis() - a.timestamp.toMillis();
	})

	// Organizes transactions by month and year
	const map: DateTransactionsMap = new Map();
	for (const transaction of transactions) {
		// Updates transaction values if date-key already exists
		const date = transaction.timestamp.toDate();
		const dateString = date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })

		if (map.has(dateString)) {
			const updatedTransactions = cloneDeep(map.get(dateString));
			updatedTransactions!.push(transaction);
			map.set(dateString, updatedTransactions!)
		} 
		// Creates new key-value pair
		else {
			map.set(dateString, [transaction])
		}
	}

	// Returned map will also be sorted by timestamp, in descending order
	// Though the map include dateString as the key, the transactions have already been ordered by timestamp
	return map;
}
