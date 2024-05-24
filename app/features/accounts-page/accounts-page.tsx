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
import { updateUnassignedBalance } from "@/firebase/budgets";
import { BudgetData } from "pages/budget";

export type AccountsPagePropsType = {
	budgetData: BudgetData;
	categories: Category[];
	subcategories: Subcategory[];
};

export function AccountsPage(props: AccountsPagePropsType) {
	const { budgetData, categories, subcategories } = props;
	const [accountsDataKey, setAccountsDataKey] = useState<boolean>(false);
	const [transactionsDataKey, setTransactionsDataKey] = useState<boolean>(false);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [unfinishedTransactions, setUnfinishedTransactions] = useState<Transaction[]>([]);

	// Retrieves accounts
	useEffect(() => {
		const fetchData = async () => {
			const accountsData = await getAccounts(budgetData.userID, budgetData.budgetID);
			sortAccountsAlphabetically(accountsData);
			setAccounts(accountsData);
		};
		fetchData();
	}, [accountsDataKey, budgetData.budgetID, budgetData.userID]);

	// Retrieves transactions
	useEffect(() => {
		const fetchData = async () => {
			const transactionsData = await getTransactions(budgetData.userID, budgetData.budgetID);
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
	}, [transactionsDataKey, budgetData.budgetID, budgetData.userID]);

	const [accountsPageRenderKey, setAccountsPageRenderKey] = useState<0 | 1>(0);
	const [subpage, setSubpage] = useState<JSX.Element | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);

	// Passed to CreateAccountSubpage
	const handleCreateAccount = (newAccount: Account) => {
		// Updates firebase 
		createAccount(budgetData.userID, budgetData.budgetID, newAccount);
		updateUnassignedBalance(budgetData.userID, budgetData.budgetID, newAccount.initialBalance);

		// Refreshes page
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
	const navigateToUnfinishedTransactionsSubpage = () => {
		showSubpage(
			<AccountTransactionsSubpage budgetData={budgetData} categories={categories} subcategories={subcategories} accounts={accounts} showingAllAccounts={false} showingUnfinishedTransactions={true} handleBackClick={hideSubpage}/>
		);
	};
	const navigateToAllTransactionsSubpage = () => {
		showSubpage(<AccountTransactionsSubpage budgetData={budgetData} categories={categories} subcategories={subcategories} accounts={accounts} showingAllAccounts={true} showingUnfinishedTransactions={false} handleBackClick={hideSubpage}/>);
	};
	const navigateToAccountTransactionsSubpage = (selectedAccount: Account, selectedTransactions: Transaction[]) => {
		showSubpage(
			<AccountTransactionsSubpage budgetData={budgetData} categories={categories} subcategories={subcategories} accounts={[selectedAccount]} showingAllAccounts={false} showingUnfinishedTransactions={false} handleBackClick={hideSubpage}/>
		);
	};
	const navigateToCreateAccountSubpage = () => {
		showSubpage(<CreateAccountSubpage handleBackClick={hideSubpage} handleCreateAccount={handleCreateAccount} />);
	};

	// Creates list of accounts
	const accountItems: JSX.Element[] = [];
	let totalAccountBalance = 0;
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		const accountBalanceString = account.balance >= 0 ? "$" + (account.balance / 1000000).toFixed(2) : "-$" + (account.balance / -1000000).toFixed(2);
		const filteredTransactions = transactions.filter((transaction) => transaction.accountID === account.id);
		totalAccountBalance += account.balance;

		accountItems.push(
			<div
				data-test-id={`account-item-${i}`}
				key={`account-item-${i}`}
				className={styles.accountItem}
				onClick={() => {
					navigateToAccountTransactionsSubpage(account, filteredTransactions);
				}}
			>
				<span key={`account-item-name-${i}`}>{account.name}</span>
				<span key={`account-item-balance-${i}`}>{accountBalanceString}</span>
			</div>
		);
	}
	// Adds "Budget" heading for list of accounts
	const totalBalanceString = totalAccountBalance >= 0 ? "$" + (totalAccountBalance / 1000000).toFixed(2) : "-$" + (totalAccountBalance / -1000000).toFixed(2);
	accountItems.unshift(
		<div data-test-id="total-item" key={"total-item"} className={classNames(styles.accountItem, styles.totalItem)}>
			<span key={"total-item-label"}>Budget</span>
			<span key={"total-item-balance"}>{totalBalanceString}</span>
		</div>
	);

	return (
		<>
			<header data-test-id="accounts-page-header" className={styles.header}>
				Accounts
			</header>
			<main data-test-id="accounts-page-main" key={accountsPageRenderKey} className={styles.main}>
				<div className={styles.subpageButtonContainer}>
					{unfinishedTransactions.length > 0 && (
						<button data-test-id="unfinished-transactions-button" className={styles.subpageButton} onClick={navigateToUnfinishedTransactionsSubpage}>
							New Transactions
							<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
						</button>
					)}
					{transactions.length > 0 && (
						<button data-test-id="all-accounts-button" className={styles.subpageButton} onClick={navigateToAllTransactionsSubpage}>
							All Accounts
							<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
						</button>
					)}
				</div>
				{accountItems}
				<div className={styles.subpageButtonContainer}>
					<button data-test-id="add-accounts-button" className={styles.subpageButton} onClick={navigateToCreateAccountSubpage}>
						Add Accounts
						<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
					</button>
				</div>
			</main>
			<section data-test-id="accounts-subpage" className={classNames(subpageClasses)}>
				{subpage}
			</section>
		</>
	);
}
