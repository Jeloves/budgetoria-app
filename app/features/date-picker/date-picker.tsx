import styles from "./date-picker.module.scss";
import { IconButton } from "../ui";
import classNames from "classnames";
import { useState } from "react";

export type DatePickerPropsType = {
	selectedMonth: number;
	selectedYear: number;
	dateInterval: DateIntervalType;
	handleMonthOnClick: (monthIndex: number, newYear: number) => void;
};

export type DateIntervalType = {
	minDate: Date;
	maxDate: Date;
};

const monthAcronyms = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function DatePicker(props: DatePickerPropsType) {
	const { selectedMonth, selectedYear, dateInterval, handleMonthOnClick } = props;
	console.log("dateIntervalObject", dateInterval);

	const [yearDisplayed, setYearDisplayed] = useState<number>(selectedYear);

	const handlePreviousYearOnClick = () => {
		const previousYear = yearDisplayed - 1;
		if (dateInterval.minDate.getFullYear() <= previousYear) {
			setYearDisplayed(yearDisplayed - 1);
		}
	};

	const handleNextYearOnClick = () => {
		const nextYear = yearDisplayed + 1;
		if (nextYear <= dateInterval.maxDate.getFullYear()) {
			setYearDisplayed(yearDisplayed + 1);
		}
	};

	let trArray: JSX.Element[] = [];
	let tdArray: JSX.Element[] = [];
	monthAcronyms.map((acronym, index) => {
		const date = new Date(yearDisplayed, index);
		const isClickable = date <= dateInterval.maxDate && dateInterval.minDate <= date ? true : false;

		const classes = {
			[styles.selected]: selectedMonth === index && selectedYear === yearDisplayed ? true : false,
			// Only dates within the dateInterval will be clickable
			[styles.unclickable]: !isClickable,
		};

		// What is INSIDE of the date interval?
		// minYear <= selectedYear <= maxYear
		// minMonth <= index <= maxMonth

		tdArray.push(
			<td
				key={index}
				className={classNames(classes)}
				onClick={() => {
					if (isClickable) {
						handleMonthOnClick(index, yearDisplayed);
					}
				}}
			>
				{acronym}
			</td>
		);
		if (index === 3 || index === 7 || index === 11) {
			trArray.push(<tr>{tdArray}</tr>);
			tdArray = [];
		}
	});

	return (
		<section className={styles.datePicker}>
			<div className={styles.datePickerContent}>
				<header>
					<IconButton button={{ onClick: handlePreviousYearOnClick }} src="/icons/arrow-left.svg" altText="Button to select previous year" />
					<h1>{yearDisplayed}</h1>
					<IconButton button={{ onClick: handleNextYearOnClick }} src="/icons/arrow-right.svg" altText="Button to select next year" />
				</header>
				<table>
					<tbody>{trArray}</tbody>
				</table>
			</div>
		</section>
	);
}
