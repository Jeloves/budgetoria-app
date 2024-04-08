/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useState } from "react";
import styles from "./transaction-page.module.scss";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { TransactionDataItem } from "./transaction-data-item/transaction-data-item";

export type TransactionPagePropsType = {
	payees: string[];
	categories: Category[];
	subcategories: Subcategory[];
	accounts: Account[];
	transaction: Transaction;
};

export function TransactionPage(props: TransactionPagePropsType) {
	const { payees, categories, subcategories, accounts, transaction } = props;
	const [isApproved, setIsApproved] = useState<boolean>(false);

	const handleChangeApprovalState = (event: ChangeEvent<HTMLInputElement>) => {
		setIsApproved(event.target.checked)
	}

	// Formatting the transaction.balance for display
	let balanceString = "";
	let balanceClass = "";
	if (transaction.balance < 0) {
		balanceString = "-$" + (transaction.balance / 1000000).toFixed(2);
		balanceClass = styles.negative;
	} else {
		balanceString = "$" + (transaction.balance / 1000000).toFixed(2);
		balanceClass = styles.positive;
	}
	return (
		<section className={styles.transaction}>
			<div className={styles.balance}>
				<div className={styles.flowSelect}>
					<button>- Outflow</button>
					<button>- Inflow</button>
				</div>
				<input type="text" defaultValue={balanceString} className={balanceClass}/>
			</div>
			<div className={styles.contentContainer}>
				<div className={styles.content}>
					<TransactionDataItem key={0} type="Payee"/>
					<TransactionDataItem key={1} type="Category"/>
					<TransactionDataItem key={2} type="Account"/>
					<TransactionDataItem key={3} type="Date"/>
					<TransactionDataItem key={4} type="Cleared"/>
					<TransactionDataItem key={5} type="Memo"/>
				</div>
			</div>
		</section>
	);
}
