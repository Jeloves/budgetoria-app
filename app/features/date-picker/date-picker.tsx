import styles from "./date-picker.module.scss";
import { IconButton } from "../ui";
import classNames from "classnames";
import { useState } from "react";

export type DatePickerPropsType = {
	selectedMonth: number;
	selectedYear: number;
	monthAcronyms: string[];
	handleMonthOnClick: (monthIndex: number, newYear: number) => void;
};

export function DatePicker(props: DatePickerPropsType) {
	const { selectedMonth, selectedYear, monthAcronyms, handleMonthOnClick } = props;

    const [yearDisplayed, setYearDisplayed] = useState<number>(selectedYear)

    const handlePreviousYearOnClick = () => {
		setYearDisplayed(yearDisplayed - 1);
	};

	const handleNextYearOnClick = () => {
        setYearDisplayed(yearDisplayed + 1);
	};

	let trArray: JSX.Element[] = [];
	let tdArray: JSX.Element[] = [];
	monthAcronyms.map((acronym, index) => {

		const classes = {
			[styles.selected]: ((selectedMonth === index) && selectedYear === yearDisplayed) ? true : false,
		};

		tdArray.push(
			<td
				key={index}
				className={classNames(classes)}
				onClick={() => {
					handleMonthOnClick(index, yearDisplayed);
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
			<header>
				<IconButton button={{ onClick: handlePreviousYearOnClick }} src="/icons/arrow-left.svg" altText="Button to select previous year" />
				<h1>{yearDisplayed}</h1>
				<IconButton button={{ onClick: handleNextYearOnClick }} src="/icons/arrow-right.svg" altText="Button to select next year" />
			</header>
			<table>
				<tbody>{trArray}</tbody>
			</table>
		</section>
	);
}
