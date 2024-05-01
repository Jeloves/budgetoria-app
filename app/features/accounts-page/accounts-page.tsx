/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import styles from "./accounts-page.module.scss";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton } from "../ui";
import { AccountTransactionsSubpage } from "./account-transactions-subpage/account-transactions-subpage";
import { createAccount, getAccounts } from "@/firebase/accounts";
import { CreateAccountSubpage } from "./create-account-subpage/create-account-subpage";
import { createTransaction, getTransactions } from "@/firebase/transactions";
import { sortAccountsAlphabetically } from "@/utils/sorting";

export type AccountsPagePropsType = {
	userID: string;
	budgetID: string;
	categories: Category[];
	subcategories: Subcategory[];
};

type NewAccountData = {
	name: string;
	initialBalance: number;
};

export function AccountsPage(props: AccountsPagePropsType) {
	const { userID, budgetID, categories, subcategories } = props;
	const [accountsDataKey, setAccountsDataKey] = useState<boolean>(false);
	const [transactionsDataKey, setTransactionsDataKey] = useState<boolean>(false);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [unfinishedTransactions, setUnfinishedTransactions] = useState<Transaction[]>([]);

	// Retrieves accounts
	useEffect(() => {
		const fetchData = async () => {
			const accountsData = await getAccounts(userID, budgetID);
			sortAccountsAlphabetically(accountsData);
			setAccounts(accountsData);
		};
		fetchData();
	}, [accountsDataKey, budgetID, userID]);

	// Retrieves transactions
	useEffect(() => {
		const fetchData = async () => {
			const transactionsData = await getTransactions(userID, budgetID);
			setTransactions(transactionsData);

			// Sets unfinished transactions
			// A transaction is unfinished if it has no associated payee, account, category, or subcategory.
			const unfinishedTransactions: Transaction[] = [];
			for (let transaction of transactionsData) {
				if (transaction.payee === "" || transaction.accountID === "" || transaction.categoryID === "" || transaction.subcategoryID === "") {
					unfinishedTransactions.push(transaction);
				}
			}
			setUnfinishedTransactions(unfinishedTransactions);
		};
		fetchData();
	}, [transactionsDataKey, budgetID, userID]);

	const [accountsPageRenderKey, setAccountsPageRenderKey] = useState<0 | 1>(0);
	const [subpage, setSubpage] = useState<JSX.Element | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);

	const handleCreateAccount = (newAccount: Account) => {
		createAccount(userID, budgetID, newAccount);
		setAccountsDataKey(!accountsDataKey);
		hideSubpage();
	};

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
		showSubpage(<AccountTransactionsSubpage categories={categories} subcategories={subcategories} accounts={accounts} showingAllAccounts={true} transactions={transactions} handleBackClick={hideSubpage} />);
	};
	const navigateToAccountTransactionsSubpage = (selectedAccount: Account, selectedTransactions: Transaction[]) => {
		showSubpage(<AccountTransactionsSubpage categories={categories} subcategories={subcategories} accounts={[selectedAccount]} showingAllAccounts={false} transactions={transactions} handleBackClick={hideSubpage} />);
	};
	const navigateToCreateAccountSubpage = () => {
		showSubpage(<CreateAccountSubpage handleBackClick={hideSubpage} handleCreateAccount={handleCreateAccount} />);
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
				data-test-id={`account_item_${i}`}
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
		<div data-test-id={`total_item`} key={"total_item"} className={classNames(styles.accountItem, styles.totalItem)}>
			<span key={"total_item_name"}>Budget</span>
			<span key={"total_item_balance"}>${(totalAccountBalance / 1000000).toFixed(2)}</span>
		</div>
	);

	return (
		<>
			<header data-test-id="accounts_page_header" className={styles.header}>
				Accounts
			</header>
			<main data-test-id="accounts_page_main" key={accountsPageRenderKey} className={styles.main}>
				<div className={styles.subpageButtonContainer}>
					{unfinishedTransactions.length > 0 && (
						<button data-test-id="unfinished_transactions_button" className={styles.subpageButton} onClick={navigateToUnfinishedTransactionsSubpage}>
							New Transactions
							<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
						</button>
					)}
					{transactions.length > 0 && (
						<button data-test-id="all_accounts_button" className={styles.subpageButton} onClick={navigateToAllTransactionsSubpage}>
							All Accounts
							<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
						</button>
					)}
				</div>
				{accountItems}
				<div className={styles.subpageButtonContainer}>
					<button data-test-id="add_accounts_button" className={styles.subpageButton} onClick={navigateToCreateAccountSubpage}>
						Add Accounts
						<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
					</button>
				</div>
			</main>
			<section className={classNames(subpageClasses)}>{subpage}</section>
		</>
	);
}
