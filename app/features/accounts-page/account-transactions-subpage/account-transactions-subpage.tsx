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
import { getTransactions, getTransactionsByAccount, getUnfinishedTransactions, updateTransaction } from "@/firebase/transactions";
import { BudgetData } from "pages/budget";
import { updateUnassignedBalance } from "@/firebase/budgets";
import { DateTransactionsMap, sortTransactionsIntoTimestampMap } from "@/utils/sorting";

export type AccountTransactionsSubpagePropsType = {
	budgetData: BudgetData;
	categories: Category[];
	subcategories: Subcategory[];
	accounts: Account[];
	showingAllAccounts: boolean;
	showingUnfinishedTransactions: boolean;
	handleBackClick: () => void;
};

export function AccountTransactionsSubpage(props: AccountTransactionsSubpagePropsType) {
	const { budgetData, accounts, showingAllAccounts, categories, subcategories, showingUnfinishedTransactions, handleBackClick } = props;

	const [transactions, setTransactions] = useState<Transaction[]>([]);
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
	const [timestampTransactionsMap, setTimestampTransactionsMap] = useState<DateTransactionsMap>(new Map());

	const [subpage, setSubpage] = useState<JSX.Element | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);

	// Fetches transactions
	useEffect(() => {
		const fetch = async () => {
			// If showing all accounts, retrieves all transactions
			if (showingAllAccounts) {
				const transactionsData: Transaction[] = await getTransactions(budgetData.userID, budgetData.budgetID);
				setTransactions(transactionsData);
			}
			// If showing unfinished transactions, retrieves unfinished transactions
			else if (showingUnfinishedTransactions) {
				const transactionsData: Transaction[] = await getUnfinishedTransactions(budgetData.userID, budgetData.budgetID);
				setTransactions(transactionsData);
			}
			// If showing specific account, retrieves corresponding transactions
			else {
				const transactionsData: Transaction[] = await getTransactionsByAccount(budgetData.userID, budgetData.budgetID, accounts[0].id);
				setTransactions(transactionsData);
			}
		};
		fetch();
	}, [accounts, budgetData, showingAllAccounts, showingUnfinishedTransactions]);

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
					transaction.timestamp
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

		// Combining initialTransactions with transactions
		const allTransactions = filteredTransactions.concat(initialTransactions);

		// Grouping transactions by timestamp in descending order
		const map: DateTransactionsMap = sortTransactionsIntoTimestampMap(allTransactions);
		setTimestampTransactionsMap(map);
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
		// Calculates change in transaction balance
		const targetTransactionIndex = transactions.findIndex((transaction) => transaction.id === updatedTransaction.id);
		const oldBalance = transactions[targetTransactionIndex].getBalance();

		const newBalance = updatedTransaction.getBalance();
		const changeInBalance = newBalance - oldBalance;

		// Updates transactions useState
		const updatedTransactions: Transaction[] = cloneDeep(transactions);
		updatedTransactions[targetTransactionIndex] = updatedTransaction;
		setTransactions(updatedTransactions);

		// Updates transaction doc
		updateTransaction(budgetData.userID, budgetData.budgetID, updatedTransaction);

		// Updates unassigned balance IF transaction is categorized under unassigned category
		if (updatedTransaction.categoryID === NIL_UUID) {
			updateUnassignedBalance(budgetData.userID, budgetData.budgetID, changeInBalance);
		}

		hideSubpage();
	};
	const navigateToTransactionSubpage = (selectedTransaction: Transaction) => {
		showSubpage(
			<TransactionPage
				budgetData={budgetData}
				categories={categories}
				subcategories={subcategories}
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
	let childKey = 0;
	let transactionItemIndex = 0;
	timestampTransactionsMap.forEach((transactions, dateString) => {
		transactionItems.push(
			<div key={childKey} className={styles.date}>
				{dateString}
			</div>
		);
		childKey++;
		for (let i = 0; i < transactions.length; i++) {
			const transaction = transactions[i];
			const payeeString = transaction.payee;
			const subcategoryNameString = getSubcategoryNameByID(transaction.subcategoryID, subcategories);
			const accountNameString = getAccountNameByID(transaction.accountID, accounts);
			transactionItems.push(
				<div
					data-test-id={`account_transaction_item_${transactionItemIndex}`}
					key={childKey}
					className={styles.transaction}
					onClick={() => {
						navigateToTransactionSubpage(transaction);
					}}
				>
					<div className={styles.select}>
						<span />
					</div>
					<span data-test-id={`account_transaction_item_${transactionItemIndex}_payee`} className={styles.payee}>
						{payeeString ? payeeString : "Payee Needed"}
					</span>
					<span data-test-id={`account_transaction_item_${transactionItemIndex}_subcategory`} className={styles.subcategory}>
						{subcategoryNameString ? subcategoryNameString : "Category Needed"}
					</span>
					<span className={styles.balanceContainer}>
						<div data-test-id={`account_transaction_item_${transactionItemIndex}_balance`} className={styles.balance}>
							{formatCurrencyBasedOnOutflow(transaction.balance, transaction.outflow)}
							{(showingAllAccounts || showingUnfinishedTransactions) && (
								<div data-test-id={`account_transaction_item_${transactionItemIndex}_account`} className={styles.accountName}>
									{accountNameString ? accountNameString : "Account Needed"}
								</div>
							)}
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
			transactionItemIndex++;
			childKey++;
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
