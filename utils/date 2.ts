import { Timestamp } from "firebase/firestore";

export function getDateStringFromTimestamp(timestamp: Timestamp): string {
	const dateObject = timestamp.toDate();
	const dateString = dateObject.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	return dateString;
}

export function getShortenedDateStringFromTimestamp(timestamp: Timestamp): string {
	const dateObject = timestamp.toDate();
	const dateString = dateObject.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
	});
	return dateString;
}

export function getDateStringFromMonthYear(year: number, month: number): string {
	const dateObject = new Date(year, month);
	const dateString = dateObject.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
	});
	return dateString;
}

export function getDayString(date: Date): string {
	return date.toLocaleString("en-US", { weekday: "long" });
}

export function compareDatesForEquality(date1: Date, date2: Date): boolean {
	let areEqual = true;

	if (date1.getFullYear() !== date2.getFullYear()) {
		areEqual = false;
	} else if (date1.getMonth() !== date2.getMonth()) {
		areEqual = false;
	} else if (date1.getDate() !== date2.getDate()) {
		areEqual = false;
	} else if (date1.getDay() !== date2.getDay()) {
		areEqual = false;
	} 

	return areEqual;
}