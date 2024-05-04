// The Array.sort function...
// Unique characters first
// Then numbers (sorted by the left-most digit) For example, [1,11,12,]
// Then letters

import { Account } from "@/firebase/models";

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