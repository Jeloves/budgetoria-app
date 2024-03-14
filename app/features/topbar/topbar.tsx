import { useState } from "react";
import Image from "next/image";
import styles from "./topbar.module.scss";
import { IconButton } from "@/features/ui/icon-button/icon-button";
import { DatePicker } from "../date-picker";

const monthAcronyms = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Topbar() {
	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());
	const [isDatePickerShowing, setIsDatePickerShowing] = useState(false);

	const handleDateDisplayOnClick = () => {
		setIsDatePickerShowing(!isDatePickerShowing);
	};

	const handleSideNavigationOnClick = () => {
		alert("Show sidenav");
	};

	const handleEditOnClick = () => {
		alert("Edit categories");
	};

	const handleCreateTransactionOnClick = () => {
		alert("Create new transaction");
	};

	const handleMonthOnClick = (monthIndex: number, newYear: number) => {
		setMonth(monthIndex);
		if (year !== newYear) {
			setYear(newYear)
		}
		setIsDatePickerShowing(false);
	};

	const dateDisplay = (
		<div className={styles.dateDisplay}>
			<span>
				{monthAcronyms[month]} {year}
			</span>
			<IconButton button={{ onClick: handleDateDisplayOnClick }} src="/icons/arrow-down.svg" altText="Button to open Date Picker" />
		</div>
	);

	return (
		<>
			<section className={styles.topbarContainer}>
				<IconButton button={{ onClick: handleSideNavigationOnClick }} src="/icons/ellipsis.svg" altText="Button to open Side Navigation" />
				{dateDisplay}
				<IconButton button={{ onClick: handleEditOnClick }} src="/icons/edit.svg" altText="Button to edit categories" />
				<IconButton button={{ onClick: handleCreateTransactionOnClick }} src="/icons/circled-dollar.svg" altText="Button to create new transaction" />
			</section>
			{isDatePickerShowing && <DatePicker selectedMonth={month} selectedYear={year} monthAcronyms={monthAcronyms} handleMonthOnClick={handleMonthOnClick} />}
		</>
	);
}
