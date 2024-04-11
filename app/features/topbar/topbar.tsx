import { useState } from "react";
import Image from "next/image";
import styles from "./topbar.module.scss";
import { IconButton } from "@/features/ui/icon-button/icon-button";
import { DatePicker } from "../date-picker";
import { DateIntervalType } from "../date-picker/date-picker";

export type TopbarPropsType = {
	month: number;
	year: number;
	dateInterval: DateIntervalType;
	handleDateChangeOnClick: (monthIndex: number, newYear: number) => void;
	handleEditCategoriesClick: () => void;
};

const monthAcronyms = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Topbar(props: TopbarPropsType) {
	const { month, year, dateInterval, handleDateChangeOnClick, handleEditCategoriesClick } = props;
	const [isDatePickerShowing, setIsDatePickerShowing] = useState(false);

	const handleDateDisplayOnClick = () => {
		setIsDatePickerShowing(!isDatePickerShowing);
	};

	const handleSideNavigationOnClick = () => {
		alert("Show sidenav");
	};

	const handleCreateTransactionOnClick = () => {
		alert("Create new transaction");
	};

	const handleMonthOnClick = (monthIndex: number, newYear: number) => {
		if (newYear !== year || monthIndex !== month) {
			handleDateChangeOnClick(monthIndex, newYear);
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
				<IconButton button={{ onClick: handleEditCategoriesClick }} src="/icons/edit.svg" altText="Button to edit categories" />
			</section>
			{isDatePickerShowing && <DatePicker selectedMonth={month} selectedYear={year} dateInterval={dateInterval} handleMonthOnClick={handleMonthOnClick} />}
		</>
	);
}
