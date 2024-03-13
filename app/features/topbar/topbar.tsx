import { useState } from "react";
import Image from "next/image";
import styles from "./topbar.module.scss";
import { IconButton } from "@/features/ui/icon-button/icon-button";

const monthAcronyms = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Topbar() {
	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());
	const [isDatePickerShowing, setIsDatePickerShowing] = useState(false);

	const handleDateDisplayOnClick = () => {
		setIsDatePickerShowing(!isDatePickerShowing);
	}

	const dateDisplay = (
		<div className={styles.dateDisplay}>
			<span>Mar 2024</span>
			<IconButton button={{onClick: handleDateDisplayOnClick}} src="/icons/arrow-down.svg" altText="Button to open Date Picker"/>
		</div>
	);

	const datePicker = (
		<section className={styles.datePicker}>
			<header>
				<h1>2024</h1>
			</header>
			<table>
				<tbody>
					<tr>
						<td>Jan</td>
						<td>Feb</td>
						<td>Mar</td>
						<td>Apr</td>
					</tr>
					<tr>
						<td>May</td>
						<td>Jun</td>
						<td>Jul</td>
						<td>Aug</td>
					</tr>
					<tr>
						<td>Sep</td>
						<td>Oct</td>
						<td>Nov</td>
						<td>Dec</td>
					</tr>
				</tbody>
			</table>
		</section>
	);

	return (
		<>
			<section className={styles.topbarContainer}>
				<IconButton src="/icons/ellipsis.svg" altText="Button to open Side Navigation" />
				{dateDisplay}
				<IconButton src="/icons/edit.svg" altText="Button to edit categories" />
				<IconButton src="/icons/circled-dollar.svg" altText="Button to create new transaction" />
			</section>
			{isDatePickerShowing && datePicker}
		</>
	);
}
