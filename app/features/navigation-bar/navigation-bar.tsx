import classNames from "classnames";
import styles from "./navigation-bar.module.scss";
import { useState } from "react";

type NavigationBarPropsType = {
	selectedPage: string;
	navigateToBudget: () => void;
	navigateToCreateTransaction: () => void;
	navigateToAccounts: () => void;
};

export function NavigationBar(props: NavigationBarPropsType) {
	const { selectedPage, navigateToBudget, navigateToCreateTransaction, navigateToAccounts } = props;

	const budgetOnClick = () => {
        navigateToBudget();
	};
	const transactionOnClick = () => {
        navigateToCreateTransaction();
	};
	const accountsOnClick = () => {
        navigateToAccounts();
	};

	return (
		<section className={styles.navigation}>
			<button className={(selectedPage === "Budget" || selectedPage === "Edit") ? styles.budgetSelected : ""} onClick={budgetOnClick}>
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<img src={(selectedPage === "Budget" || selectedPage === "Edit") ? "/icons/cash-grey-100.svg" : "/icons/cash.svg"} alt="Navigation to BudgetPage" />
				Budget
			</button>
			<button className={selectedPage === "Create Transaction" ? styles.transactionSelected : ""} onClick={transactionOnClick}>
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<img src={selectedPage === "Create Transaction" ? "/icons/circled-plus-filled-grey-100.svg" : "/icons/circled-plus-filled.svg"} alt="Button to create a Transaction" />
				Transaction
			</button>
			<button className={selectedPage === "Accounts" ? styles.accountsSelected : ""} onClick={accountsOnClick}>
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<img src={selectedPage === "Accounts" ? "/icons/bank-grey-100.svg" : "/icons/bank.svg"} alt="Navigation to AccountsPage" />
				Accounts
			</button>
		</section>
	);
}
