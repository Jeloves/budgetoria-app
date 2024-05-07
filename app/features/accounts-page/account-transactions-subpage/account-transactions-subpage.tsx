import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import styles from "./account-transactions-subpage.module.scss";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { IconButton } from "@/features/ui";
import { v4 as uuidv4 } from "uuid";
import { NIL as NIL_UUID } from "uuid";
import { cloneDeep } from "lodash";
import { getAccountNameByID, getCategoryNameByID, getSubcategoryNameByID } from "@/utils/getByID";
import { formatCurrencyBasedOnOutflow } from "@/utils/currency";
import { TransactionPage } from "@/features/transaction-page/transaction-page";
import { updateTransaction } from "@/firebase/transactions";
import { BudgetData } from "pages/budget";

export type AccountTransactionsSubpagePropsType = {
	budgetData: BudgetData;
	userID: string;
	budgetID: string;
	categories: Category[];
	subcategories: Subcategory[];
	accounts: Account[];
	showingAllAccounts: boolean;
	transactions: Transaction[];
	showingUnfinishedTransactions: boolean;
	handleBackClick: () => void;
};

type DateTransactionsMap = Map<string, Transaction[]>;

export function AccountTransactionsSubpage(props: AccountTransactionsSubpagePropsType) {
	const { budgetData, userID, budgetID, accounts, showingAllAccounts, categories, subcategories, showingUnfinishedTransactions, handleBackClick } = props;

	const [transactions, setTransactions] = useState<Transaction[]>(props.transactions);
	const [clearedTransactions, setClearedTransactions] = useState<Transaction[]>([]);
	const [unclearedTransactions, setUnclearedTransactions] = useState<Transaction[]>([]);

	const [clearedBalance, setClearedBalance] = useState<number>(0);
	const [unclearedBalance, setUnclearedBalance] = useState<number>(0);
	const [workingBalance, setWorkingBalance] = useState<number>(0);
	const [clearedBalanceString, setClearedBalanceString] = useState<string>("");
	const [unclearedBalanceString, setUnclearedBalanceString] = useState<string>("");
	const [workingBalanceString, setWorkingBalanceString] = useState<string>("");

	const [filter, setFilter] = useState<string>("");
	const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
	const [dateTransactionsMap, setDateTransactionsMap] = useState<DateTransactionsMap>(new Map());

	const [subpage, setSubpage] = useState<JSX.Element | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);

	// Separates cleared from uncleared transactions
	useEffect(() => {
		const cleared: Transaction[] = [];
		const uncleared: Transaction[] = [];
		for (let transaction of transactions) {
			if (transaction.approval) {
				cleared.push(transaction);
			} else {
				uncleared.push(transaction);
			}
		}
		setClearedTransactions(cleared);
		setUnclearedTransactions(uncleared);
	}, [transactions]);

	// Calculates cleared, uncleared, and working balance
	useEffect(() => {
		// Calculates sum of account initial balances
		let initialAccountSum = 0;
		for (let account of accounts) {
			initialAccountSum += account.initialBalance;
		}

		// Calculates sum of cleared transaction balances, which includes initial account balances
		let clearedTransactionSum = initialAccountSum;
		for (let transaction of clearedTransactions) {
			clearedTransactionSum += transaction.balance;
		}
		setClearedBalance(clearedTransactionSum);

		// Calculates sum of uncleared transaction balances
		let unclearedTransactionSum = 0;
		for (let transaction of unclearedTransactions) {
			unclearedTransactionSum += transaction.balance;
		}
		setUnclearedBalance(unclearedTransactionSum);

		// Calculating the working balance
		const workingAccountSum = clearedTransactionSum + unclearedTransactionSum;
		setWorkingBalance(workingAccountSum);
	}, [accounts, clearedTransactions, unclearedTransactions]);

	// Formats balances into strings
	useEffect(() => {
		// Formats cleared balance
		if (clearedBalance > 0) {
			setClearedBalanceString("$" + (clearedBalance / 1000000).toFixed(2));
		} else if (clearedBalance < 0) {
			setClearedBalanceString("-$" + (clearedBalance / -1000000).toFixed(2));
		} else {
			setClearedBalanceString("$0.00");
		}

		// Formats uncleared balance
		if (unclearedBalance > 0) {
			setUnclearedBalanceString("$" + (unclearedBalance / 1000000).toFixed(2));
		} else if (unclearedBalance < 0) {
			setUnclearedBalanceString("-$" + (unclearedBalance / -1000000).toFixed(2));
		} else {
			setUnclearedBalanceString("$0.00");
		}

		// Formats working balance
		if (workingBalance > 0) {
			setWorkingBalanceString("$" + (workingBalance / 1000000).toFixed(2));
		} else if (workingBalance < 0) {
			setWorkingBalanceString("-$" + (workingBalance / -1000000).toFixed(2));
		} else {
			setWorkingBalanceString("$0.00");
		}
	}, [clearedBalance, unclearedBalance, workingBalance]);

	// Filters transactions
	useEffect(() => {
		// Filter can search for category, subcategory, payee, or amount, and date
		if (filter === "") {
			setFilteredTransactions(transactions);
		} else {
			const filtered = transactions.filter((transaction) => {
				// Filter for category
				if (getCategoryNameByID(transaction.categoryID, categories).includes(filter)) {
					return transaction;
				}
				// Filter for subcategory
				else if (getSubcategoryNameByID(transaction.subcategoryID, subcategories).includes(filter)) {
					return transaction;
				}
				// Filter for payee
				else if (transaction.payee.includes(filter)) {
					return transaction;
				}
				// Filter for date
				else if (
					transaction.date
						.toDate()
						.toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})
						.includes(filter)
				) {
					return transaction;
				}
				// Filter for transaction balance
				else if ((transaction.balance / 1000000).toFixed(2).toString().includes(filter)) {
					return transaction;
				}
			});
			setFilteredTransactions(filtered);
		}
	}, [categories, filter, subcategories, transactions]);

	// Grouping transactions by date, including Transaction objects for initial account balances
	// The resulting dateTransactionsMap is therefore ordered by date in descending order
	useEffect(() => {
		// Creating transactions to represent initial account balances
		const initialTransactions: Transaction[] = [];
		for (let account of accounts) {
			const transactionID = "initial_balance_" + uuidv4();
			const date = account.date;
			const payee = "Starting Balance";
			const memo = "";
			const outflow = account.initialBalance < 0 ? true : false;
			const balance = account.initialBalance < 0 ? account.initialBalance * -1 : account.initialBalance;
			const approval = true;
			const accountID = account.id;
			const categoryID = NIL_UUID;
			const subcategoryID = NIL_UUID;
			initialTransactions.push(new Transaction(transactionID, date, payee, memo, outflow, balance, approval, accountID, categoryID, subcategoryID));
		}

		// Grouping transactions by date in descending order
		const allTransactions = filteredTransactions.concat(initialTransactions);
		allTransactions.sort((a, b) => b.date.toMillis() - a.date.toMillis());
		const newDateTransactionsMap: DateTransactionsMap = new Map();
		for (const transaction of allTransactions) {
			const dateISOString = transaction.date.toDate().toISOString();
			if (newDateTransactionsMap.has(dateISOString)) {
				const updatedTransactions = cloneDeep(newDateTransactionsMap.get(dateISOString));
				updatedTransactions!.push(transaction);
				newDateTransactionsMap.set(dateISOString, updatedTransactions!);
			} else {
				newDateTransactionsMap.set(dateISOString, [transaction]);
			}
		}
		setDateTransactionsMap(newDateTransactionsMap);
	}, [filteredTransactions, accounts]);

	// Opens transaction subpage
	const showSubpage = (selectedSubpage: JSX.Element) => {
		setSubpage(selectedSubpage);
		setSubpageClasses([styles.subpage, styles.show]);
	};
	const hideSubpage = () => {
		setSubpage(null);
		setSubpageClasses([styles.subpage, styles.hide]);
	};
	const handleUpdateTransaction = (updatedTransaction: Transaction) => {
		const updatedTransactions: Transaction[] = cloneDeep(transactions);
		const targetIndex = transactions.findIndex(transaction => transaction.id === updatedTransaction.id);
		updatedTransactions[targetIndex] = updatedTransaction;
		setTransactions(updatedTransactions);
		updateTransaction(userID, budgetID, updatedTransaction);
		hideSubpage();
	};
	const navigateToTransactionSubpage = (selectedTransaction: Transaction) => {
		showSubpage(
			<TransactionPage
				budgetData={budgetData}
				userID={userID}
				budgetID={budgetID}
				categories={categories}
				subcategories={subcategories}
				accounts={accounts}
				transaction={selectedTransaction}
				isCreatingTransaction={false}
				handleCreateTransaction={handleUpdateTransaction}
				hideTransactionPage={hideSubpage}
			/>
		);
	};

	// Filter can search for category, subcategory, payee, or amount, and date
	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.currentTarget.value);
	};

	// Generates filtered transaction elements
	const transactionItems: JSX.Element[] = [];
	dateTransactionsMap.forEach((transactions, dateISOString) => {
		const dateString = new Date(dateISOString).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

		transactionItems.push(<div className={styles.date}>{dateString}</div>);
		for (let i = 0; i < transactions.length; i++) {
			const transaction = transactions[i];
			const payeeString = transaction.payee;
			const subcategoryNameString = getSubcategoryNameByID(transaction.subcategoryID, subcategories);
			const accountNameString = getAccountNameByID(transaction.accountID, accounts);

			// Formatting strings for transaction data
			transactionItems.push(
				<div
					className={styles.transaction}
					onClick={() => {
						navigateToTransactionSubpage(transaction);
					}}
				>
					<div className={styles.select}>
						<span />
					</div>
					<span className={styles.payee}>{payeeString ? payeeString : "Payee Needed"}</span>
					<span className={styles.subcategory}>{subcategoryNameString ? subcategoryNameString : "Category Needed"}</span>
					<span className={styles.balanceContainer}>
						<div className={styles.balance}>
							{formatCurrencyBasedOnOutflow(transaction.balance, transaction.outflow)}
							{(showingAllAccounts || showingUnfinishedTransactions) && <div className={styles.accountName}>{accountNameString ? accountNameString : "Account Needed"}</div>}
						</div>
						{transaction.approval ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src="/icons/cleared.svg" alt="Cleared transaction icon" />
						) : (
							// eslint-disable-next-line @next/next/no-img-element
							<img src="/icons/uncleared.svg" alt="Uncleared transaction icon" />
						)}
					</span>
				</div>
			);
		}
	});

	return (
		<>
			<header data-test-id="account_transactions_subpage_header" className={styles.header}>
				<IconButton button={{ onClick: handleBackClick }} src={"/icons/arrow-left-grey-100.svg"} altText={"Button to return to Accounts Page"} />
				<span>{showingAllAccounts ? "All Accounts" : showingUnfinishedTransactions ? "New Transactions" : accounts[0].name}</span>
				<IconButton button={{ onClick: handleBackClick }} src={"/icons/edit-grey-100.svg"} altText={"Navigate to Edit Account Page"} />
			</header>
			<main data-test-id="account_transactions_subpage_main" className={styles.main}>
				<div className={styles.balances}>
					<span className={styles.totalLabel}>Total</span>
					<span className={styles.totalBalance}>{workingBalanceString}</span>
					<div className={styles.cleared}>
						Cleared
						<span>{clearedBalanceString}</span>
					</div>
					<div className={styles.uncleared}>
						Uncleared
						<span>{unclearedBalanceString}</span>
					</div>
				</div>
				<div className={styles.filter}>
					{/*eslint-disable-next-line @next/next/no-img-element */}
					<img src="/icons/search-grey-300.svg" alt="Search icon" />
					<input type="text" placeholder="Search Transactions" onChange={handleFilterChange} />
				</div>
				{transactionItems}
			</main>
			<section data-test-id="account_transactions_subpage_subpage" className={classNames(subpageClasses)}>
				{subpage}
			</section>
		</>
	);
}
