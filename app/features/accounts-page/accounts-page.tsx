/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import styles from "./accounts-page.module.scss";
import { Account, Subcategory, Transaction } from "@/firebase/models";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton } from "../ui";
import { AccountTransactionsSubpage } from "./account-transactions-subpage/account-transactions-subpage";
import { createAccount, getAccounts } from "@/firebase/accounts";
import { CreateAccountSubpage } from "./create-account-subpage/create-account-subpage";
import { createTransaction, getTransactions } from "@/firebase/transactions";

export type AccountsPagePropsType = {
	userID: string;
	budgetID: string;
	subcategories: Subcategory[];
};

type NewAccountData = {
	name: string;
	initialBalance: number;
};

export function AccountsPage(props: AccountsPagePropsType) {
	const { userID, budgetID, subcategories } = props;
	const [accountsDataKey, setAccountsDataKey] = useState<boolean>(false);
	const [transactionsDataKey, setTransactionsDataKey] = useState<boolean>(false);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [unfinishedTransactions, setUnfinishedTransactions] = useState<Transaction[]>([]);

	// Retrieves accounts
	useEffect(() => {
		const fetchData = async () => {
			const accountsData = await getAccounts(userID, budgetID);
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
			setUnfinishedTransactions(unfinishedTransactions)
		};
		fetchData();
	}, [transactionsDataKey, budgetID, userID]);


	const [accountsPageRenderKey, setAccountsPageRenderKey] = useState<0 | 1>(0);
	const [initialBalanceRenderKey, setInitialBalanceRenderKey] = useState<0 | 1>(0);
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
		showSubpage(<AccountTransactionsSubpage subcategories={subcategories} accounts={accounts} showingAllAccounts={true} transactions={transactions} handleBackClick={hideSubpage}/>);
	};
	const navigateToAccountTransactionsSubpage = (selectedAccount: Account, selectedTransactions: Transaction[]) => {
		const clearedTransactions = selectedTransactions.filter((transaction) => transaction.approval);
		const unclearedTransactions = selectedTransactions.filter((transaction) => !transaction.approval);
		showSubpage(<AccountTransactionsSubpage subcategories={subcategories} account={selectedAccount} clearedTransactions={clearedTransactions} unclearedTransactions={unclearedTransactions} handleBackClick={hideSubpage} />);
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
