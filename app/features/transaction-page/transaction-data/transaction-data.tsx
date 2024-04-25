import { ChangeEvent, useEffect, useState } from "react";
import styles from "./transaction-data.module.scss";

/* eslint-disable @next/next/no-img-element */
export type TransactionDataPropsType = {
	type: "Payee" | "Category" | "Account" | "Date";
	data: string;
	categoryName: string;
	handleOnClick: () => void;
};

export function TransactionData(props: TransactionDataPropsType) {
	const { type, data, categoryName, handleOnClick } = props;
	const [isApproved, setIsApproved] = useState<boolean>(false);

	// Selecting the correct icon
	let icon = "";
	switch (type) {
		case "Payee":
			icon = "/icons/exchange.svg";
			break;
		case "Category":
			icon = "/icons/cash-grey-100.svg";
			break;
		case "Account":
			icon = "/icons/bank-grey-100.svg";
			break;
		case "Date":
			icon = "/icons/calendar-grey-100.svg";
			break;
	}

	// Selecting the correct h1 label
	let label: string = type;
	if (type === "Category" && categoryName) {
		label = categoryName;
	} 

	return (
		<button className={styles.transactionData} onClick={handleOnClick}>
			<div className={styles.iconContainer}>
				<img src={icon} alt={type + "icon"} />
			</div>
			<h1>{label}</h1>
			<h2 className={data ? "" : styles.unselected}>{data ? data : `Select ${type}...`}</h2>
			<img className={styles.arrow} src="/icons/arrow-right-grey-500.svg" alt="Arrow icon" />
			<hr className={styles.border} />
		</button>
	);
}
