import { ChangeEvent, useEffect, useState } from "react";
import styles from "./transaction-data-item.module.scss";

/* eslint-disable @next/next/no-img-element */
export type TransactionDataItemPropsType = {
	type: "Payee" | "Category" | "Account" | "Date" | "Cleared" | "Memo";
};

export function TransactionDataItem(props: TransactionDataItemPropsType) {
	const { type } = props;
	const [data, setData] = useState<string>("");
	const [isApproved, setIsApproved] = useState<boolean>(false);

	const handleChangeApprovalState = (event: ChangeEvent<HTMLInputElement>) => {
		setIsApproved(event.target.checked);
	};

	if (type === "Cleared") {
		return (
			<button className={styles.approval}>
				<img src={isApproved ? "/icons/cleared.svg" : "/icons/cleared-grey-100.svg"} alt="Cleared icon" />
				<h2>Cleared</h2>
				<label className={styles.switch}>
					<input type="checkbox" onChange={handleChangeApprovalState} />
					<span className={styles.slider} />
				</label>
			</button>
		);
	} else if (type === "Memo") {
		return (
			<button className={styles.transactionData}>
				<div className={styles.iconContainer}>
					<img src="/icons/memo-grey-100.svg" alt="" />
				</div>
				<h1>Memo</h1>
				<input type="text" placeholder="Enter memo..." />
				<hr className={styles.border} />
			</button>
		);
	} else {
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

		return (
			<button className={styles.transactionData}>
				<div className={styles.iconContainer}>
					<img src={icon} alt={type + "icon"} />
				</div>
				<h1>{type}</h1>
				<h2 className={data ? styles.unselected : ""}>{data ? data : `Select ${type}...`}</h2>
				<img className={styles.arrow} src="/icons/arrow-right-grey-500.svg" alt="Arrow icon" />
				<hr className={styles.border} />
			</button>
		);
	}
}
