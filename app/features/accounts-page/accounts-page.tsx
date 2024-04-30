/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import styles from "./accounts-page.module.scss";
import { Account, Subcategory, Transaction } from "@/firebase/models";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton } from "../ui";
import { AccountTransactionsSubpage } from "./account-transactions-subpage/account-transactions-subpage";

export type AccountsPagePropsType = {
	accounts: Account[];
	subcategories: Subcategory[];
	transactions: Transaction[];
	handleConfirmNewAccount: (newAccount: Account) => void;
};

type NewAccountData = {
	name: string;
	initialBalance: number;
};

export function AccountsPage(props: AccountsPagePropsType) {
	const { subcategories, handleConfirmNewAccount } = props;
	const [accounts, setAccounts] = useState<Account[]>(props.accounts);
	const [transactions, setTransactions] = useState<Transaction[]>(props.transactions);
	const [unfinishedTransactions, setUnfinishedTransactions] = useState<Transaction[]>(
		props.transactions.filter((transaction) => {
			return transaction.accountID === "" || transaction.categoryID === "" || transaction.subcategoryID === "" || transaction.payee === "";
		})
	);

	// Checks for unfinished transactions
	useEffect(() => {
		const unfinished: Transaction[] = [];
		for (let transaction of transactions) {
			// A transaction is unfinished if it has no associated payee, account, category, or subcategory.
			if (transaction.payee === "" || transaction.accountID === "" || transaction.categoryID === "" || transaction.subcategoryID === "") {
				unfinished.push(transaction);
			}
		}
		setUnfinishedTransactions(unfinished);
	}, [transactions]);

	const [newAccountData, setNewAccountData] = useState<NewAccountData>({ name: "", initialBalance: 0 });
	const [accountsPageRenderKey, setAccountsPageRenderKey] = useState<0 | 1>(0);
	const [initialBalanceRenderKey, setInitialBalanceRenderKey] = useState<0 | 1>(0);

	const [subpage, setSubpage] = useState<JSX.Element | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);

	const showSubpage = (selectedSubpage: JSX.Element) => {
		setSubpage(selectedSubpage);
		setSubpageClasses([styles.subpage, styles.show]);
	};
	const hideSubpage = () => {
		setSubpage(null);
		setSubpageClasses([styles.subpage, styles.hide]);
	};
	const navigateToUnfinishedTransactionsSubpage = () => {};
	const navigateToAllTransactionsSubpage = () => {
		const clearedTransactions = transactions.filter((transaction) => transaction.approval);
		const unclearedTransactions = transactions.filter((transaction) => !transaction.approval);
		showSubpage(<AccountTransactionsSubpage subcategories={subcategories} account={selectedAccount}  handleBackClick={hideSubpage} />);
	};
	const navigateToAccountTransactionsSubpage = (selectedAccount: Account, selectedTransactions: Transaction[]) => {
		const clearedTransactions = selectedTransactions.filter((transaction) => transaction.approval);
		const unclearedTransactions = selectedTransactions.filter((transaction) => !transaction.approval);
		showSubpage(<AccountTransactionsSubpage subcategories={subcategories} account={selectedAccount} clearedTransactions={clearedTransactions} unclearedTransactions={unclearedTransactions} handleBackClick={hideSubpage} />);
	};
	const navigateToCreateAccountSubpage = () => {};

	const handleShowAddAccountElement = () => {
		const element = document.getElementById("add_account_element_id");
		if (element) {
			element!.classList.remove(styles.hideAddAccount);
			element!.classList.add(styles.displayAddAccount);
		}
	};
	const handleHideAddAccountElement = () => {
		const element = document.getElementById("add_account_element_id");
		if (element) {
			element!.classList.remove(styles.displayAddAccount);
			element!.classList.add(styles.hideAddAccount);
			setNewAccountData({ name: "", initialBalance: 0 });
		}
	};
	const handleVerifyNewAccount = () => {
		if (newAccountData.name === "") {
			alert("The new account must have a name.");
		} else {
			const newAccount = new Account(uuidv4(), newAccountData.name, newAccountData.initialBalance, newAccountData.initialBalance);
			handleConfirmNewAccount(newAccount);
			handleHideAddAccountElement();
			accounts.push(newAccount);
			setAccountsPageRenderKey(accountsPageRenderKey === 0 ? 1 : 0);
		}
	};

	// Creates list of accounts
	const accountItems: JSX.Element[] = [];
	let totalAccountBalance = 0;
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		const filteredTransactions = transactions.filter((transaction) => transaction.accountID === account.id);
		totalAccountBalance += account.balance;
		accountItems.push(
			<div
				key={`account_item_${i}`}
				className={styles.accountItem}
				onClick={() => {
					navigateToAccountTransactionsSubpage(account, filteredTransactions);
				}}
			>
				<span key={`account_item_name_${i}`}>{account.name}</span>
				<span key={`account_item_balance_${i}`}>${(account.balance / 1000000).toFixed(2)}</span>
			</div>
		);
	}
	// Adds "Budget" heading for list of accounts
	accountItems.unshift(
		<div key={"total_item_0"} className={classNames(styles.accountItem, styles.totalItem)}>
			<span key={"total_item_name_0"}>Budget</span>
			<span key={"total_item_balance_0"}>${(totalAccountBalance / 1000000).toFixed(2)}</span>
		</div>
	);

	return (
		<>
			<header className={styles.header}>Accounts</header>
			<main key={accountsPageRenderKey} className={styles.main}>
				<div className={styles.subpageButtonContainer}>
					{unfinishedTransactions.length > 0 && (
						<button className={styles.subpageButton} onClick={navigateToUnfinishedTransactionsSubpage}>
							New Transactions
							<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
						</button>
					)}
					<button className={styles.subpageButton} onClick={navigateToAllTransactionsSubpage}>
						All Accounts
						<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
					</button>
				</div>

				{accountItems}
				<div className={styles.subpageButtonContainer}>
					<button className={styles.subpageButton} onClick={navigateToCreateAccountSubpage}>
						Add Accounts
						<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
					</button>
				</div>
			</main>
			<section className={classNames(subpageClasses)}>{subpage}</section>
		</>
	);
}
