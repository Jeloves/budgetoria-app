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

export function getDayString(date: Date): string {
	return date.toLocaleString('en-US', { weekday: 'long' });
}
