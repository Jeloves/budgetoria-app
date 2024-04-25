import { Timestamp } from "firebase/firestore";
import styles from "./date-selection-subpage.module.scss";
import { useState } from "react";
import { getShortenedDateStringFromTimestamp } from "@/utils/date";

export type DateSelectionSubpagePropsType = {
	timestamp: Timestamp;
};

export function DateSelectionSubpage(props: DateSelectionSubpagePropsType) {
	const { timestamp } = props;

	const [date, setDate] = useState<Date>(timestamp.toDate());

	const [yearDisplay, setYearDisplay] = useState<number>(timestamp.toDate().getFullYear());
	const [monthDisplay, setMonthDisplay] = useState<number>(timestamp.toDate().getMonth());

	const currentCalendarElement: JSX.Element[] = [];

	// Calculating first weekday of month (0-6, Sun-Sat)
	const firstDayOfMonth = new Date(yearDisplay, monthDisplay, 1);
	const firstWeekdayOfMonth = firstDayOfMonth.getDay(); // 0-6 Sunday-Saturday

	// Calculating last weekday of month (0-6, Sun-Sat)
	let lastDayOfMonth;
	let lastWeekdayOfMonth;
	if (monthDisplay === 11) {
		const firstDayOfNextMonth = new Date(yearDisplay + 1, 0, 1);
		lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 86400000);
		lastWeekdayOfMonth = lastDayOfMonth!.getDay();
	} else {
		const firstDayOfNextMonth = new Date(yearDisplay, monthDisplay + 1, 1);
		lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 86400000);
		lastWeekdayOfMonth = lastDayOfMonth!.getDay();
	}

	let emptyKey = 1; // Tracks empty cells for key values
	let day = 1; // Tracks current day when iterating
	for (let week = 1; week <= 5; week++) {
		const row: JSX.Element[] = [];
		for (let weekday = 0; weekday < 7; weekday++) {

			const dayCell = <td key={`week${week}-day${weekday}`}>{day}</td>;
			const emptyCell = <td key={`week${week}-empty${emptyKey}`}>e</td>;

			if (week === 1) {
				// If it is the first week...
				// Add sempty cells until the first weekday is found
				if (weekday < firstWeekdayOfMonth) {
					row.push(emptyCell);
					emptyKey++;
				} else {
					row.push(dayCell);
					day++;
				}
			} else if (week === 5) {
				// If it is the last week...
				// Adds empty cells after the last weekday, until all cells filled
				if (weekday > lastWeekdayOfMonth) {
					row.push(emptyCell);
					emptyKey++;
				} else {
					row.push(dayCell);
					day++;
				}
			} else {
				// If it is neither the first nor last week...
				row.push(dayCell);
				day++;
			}
		}
		currentCalendarElement.push(<tr>{row}</tr>);
	}

	return (
		<>
			<header className={styles.header}>{getShortenedDateStringFromTimestamp(timestamp)}</header>
			<main className={styles.main}>
				<table>{currentCalendarElement}</table>
			</main>
		</>
	);
}
