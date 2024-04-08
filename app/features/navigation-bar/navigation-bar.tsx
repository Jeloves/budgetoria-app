import classNames from "classnames";
import styles from "./navigation-bar.module.scss";
import { useState } from "react";

type NavigationBarPropsType = {
	navigateToBudget: () => void;
	navigateToCreateTransaction: () => void;
	navigateToAccounts: () => void;
};

export function NavigationBar(props: NavigationBarPropsType) {
	const { navigateToBudget, navigateToCreateTransaction, navigateToAccounts } = props;
	const [selectedPage, setSelectedPage] = useState<"Budget" | "Transaction" | "Accounts">("Budget");

	const budgetOnClick = () => {
		setSelectedPage("Budget");
        navigateToBudget();
	};
	const transactionOnClick = () => {
		setSelectedPage("Transaction");
        navigateToCreateTransaction();
	};
	const accountsOnClick = () => {
		setSelectedPage("Accounts");
        navigateToAccounts();
	};

	return (
		<section className={styles.navigation}>
			<button className={selectedPage === "Budget" ? styles.budgetSelected : ""} onClick={budgetOnClick}>
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<img src={selectedPage === "Budget" ? "/icons/cash-grey-100.svg" : "/icons/cash.svg"} alt="Navigation to BudgetPage" />
				Budget
			</button>
			<button className={selectedPage === "Transaction" ? styles.transactionSelected : ""} onClick={transactionOnClick}>
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<img src={selectedPage === "Transaction" ? "/icons/circled-plus-filled-grey-100.svg" : "/icons/circled-plus-filled.svg"} alt="Button to create a Transaction" />
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
