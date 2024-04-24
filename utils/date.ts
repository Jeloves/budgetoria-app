import { Timestamp } from "firebase/firestore";

export function getDateStringFromTimestamp(timestamp: Timestamp) {
	const dateObject = timestamp.toDate();
	const dateString = dateObject.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	return dateString;
}
