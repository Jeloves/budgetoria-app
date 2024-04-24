// The Array.sort function...
// Unique characters first
// Then numbers (sorted by the left-most digit) For example, [1,11,12,]
// Then letters

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
