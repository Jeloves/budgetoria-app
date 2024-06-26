import { Timestamp } from "firebase/firestore";
import styles from "./date-selection-subpage.module.scss";
import { useState } from "react";
import { compareDatesForEquality, getDateStringFromMonthYear, getShortenedDateStringFromTimestamp } from "@/utils/date";
import { IconButton } from "@/features/ui";

export type DateSelectionSubpagePropsType = {
	date: Date;
	handleBackClick: () => void;
	selectDate: (newDate: Date) => void;
};

export function DateSelectionSubpage(props: DateSelectionSubpagePropsType) {
	const { date, handleBackClick, selectDate } = props;
	const [renderKey, setRenderKey] = useState<1 | 0>(0);

	const [displayedYear, setDisplayedYear] = useState<number>(date.getFullYear());
	const [displayedMonth, setDisplayedMonth] = useState<number>(date.getMonth());

	const handleShowNextCalendarMonth = () => {
		if (displayedMonth === 11) {
			setDisplayedYear(displayedYear + 1);
			setDisplayedMonth(0);
		} else {
			setDisplayedMonth(displayedMonth + 1);
		}
		setRenderKey(renderKey === 0 ? 1 : 0);
	};
	const handleShowPreviousCalendarMonth = () => {
		if (displayedMonth === 1) {
			setDisplayedYear(displayedYear - 1);
			setDisplayedMonth(11);
		} else {
			setDisplayedMonth(displayedMonth - 1);
		}
		setRenderKey(renderKey === 0 ? 1 : 0);
	};
	
	const currentCalendarElement: JSX.Element[] = []

	// Calculating first weekday of month (0-6, Sun-Sat)
	const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1);
	const firstWeekdayOfMonth = firstDayOfMonth.getDay(); // 0-6 Sunday-Saturday

	// Calculating last weekday of month (0-6, Sun-Sat)
	let lastDayOfMonth;
	let lastWeekdayOfMonth;
	if (displayedMonth === 11) {
		const firstDayOfNextMonth = new Date(displayedYear + 1, 0, 1);
		lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 86400000);
		lastWeekdayOfMonth = lastDayOfMonth!.getDay();
	} else {
		const firstDayOfNextMonth = new Date(displayedYear, displayedMonth + 1, 1);
		lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 86400000);
		lastWeekdayOfMonth = lastDayOfMonth!.getDay();
	}

	let emptyKey = 1; // Tracks empty cells for key values
	let day = 1; // Tracks current day when iterating
	for (let week = 1; week <= 5; week++) {
		const row: JSX.Element[] = [];
		for (let weekday = 0; weekday < 7; weekday++) {
			const dayParam = day;
			const isSelectedDate = compareDatesForEquality(date, new Date(displayedYear, displayedMonth, dayParam));
			const dayCell = isSelectedDate ? (
				<td key={`week${week}-day${weekday}`} onClick={handleBackClick}>
					<span>{day}</span>
				</td>
			) : (
				<td
					key={`week${week}-day${weekday}`}
					onClick={() => {
						selectDate(new Date(displayedYear, displayedMonth, dayParam));
					}}
				>
					{day}
				</td>
			);

			const emptyCell = <td key={`week${week}-empty${emptyKey}`}></td>;

			if (week === 1) {
				// If it is the first week...
				// Adds empty cells until the first weekday is found
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
		currentCalendarElement.push(<tr key={`week${week}`}>{row}</tr>);
	}

	return (
		<section key={renderKey}>
			<header className={styles.header}>
				<button className={styles.changeDate}>
					{getDateStringFromMonthYear(displayedYear, displayedMonth)}
				</button>
				<div className={styles.changeCalendar}>
					<IconButton button={{ onClick: handleShowPreviousCalendarMonth }} src={"/icons/arrow-left-grey-100.svg"} altText={"Button to show previous calendar"} />
					<IconButton button={{ onClick: handleShowNextCalendarMonth }} src={"/icons/arrow-right-grey-100.svg"} altText={"Button to show next calendar"} />
				</div>
			</header>
			<main className={styles.main}>
				<table className={styles.calendar}>
					<thead>
						<tr key={"weekdayLabels"} className={styles.weekdayLabels}>
							<td key={"weekday1"}>SUN</td>
							<td key={"weekday2"}>MON</td>
							<td key={"weekday3"}>TUE</td>
							<td key={"weekday4"}>WED</td>
							<td key={"weekday5"}>THU</td>
							<td key={"weekday6"}>FRI</td>
							<td key={"weekday7"}>SAT</td>
						</tr>
					</thead>
					<tbody>{currentCalendarElement}</tbody>
				</table>	
			</main>
		</section>
	);
}
