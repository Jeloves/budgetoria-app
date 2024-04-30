import { Account, Subcategory, Transaction } from "@/firebase/models";
import styles from "./account-transactions-subpage.module.scss";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { IconButton } from "@/features/ui";
import { v4 as uuidv4 } from "uuid";
import { NIL as NIL_UUID } from "uuid";
import { cloneDeep } from "lodash";

export type AccountTransactionsSubpagePropsType = {
	subcategories: Subcategory[];
	accounts: Account[];
	showingAllAccounts: boolean;
	transactions: Transaction[];
	handleBackClick: () => void;
};

type DateTransactionsMap = Map<string, Transaction[]>;

export function AccountTransactionsSubpage(props: AccountTransactionsSubpagePropsType) {
	const { accounts, transactions, subcategories, handleBackClick } = props;

	const [clearedTransactions, setClearedTransactions] = useState<Transaction[]>([]);
	const [unclearedTransactions, setUnclearedTransactions] = useState<Transaction[]>([]);

	const [clearedBalance, setClearedBalance] = useState<number>(0);
	const [unclearedBalance, setUnclearedBalance] = useState<number>(0);
	const [workingBalance, setWorkingBalance] = useState<number>(0);
	const [clearedBalanceString, setClearedBalanceString] = useState<string>("");
	const [unclearedBalanceString, setUnclearedBalanceString] = useState<string>("");
	const [workingBalanceString, setWorkingBalanceString] = useState<string>("");

	const [dateTransactionsMap, setDateTransactionsMap] = useState<DateTransactionsMap>(new Map());
	const [payees, setPayees] = useState<string[]>([]);
	const [filter, setFilter] = useState<string>("");

	// Separates cleared from uncleared transactions, and generates list of payees
	useEffect(() => {
		const cleared: Transaction[] = [];
		const uncleared: Transaction[] = [];
		const payeesList: string[] = [];
		for (let transaction of transactions) {
			if (transaction.approval) {
				cleared.push(transaction);
			} else {
				uncleared.push(transaction);
			}

			if (!payeesList.includes(transaction.payee) && transaction.payee !== "") {
				payeesList.push(transaction.payee);
			}
		}
		setClearedTransactions(cleared);
		setUnclearedTransactions(uncleared);
		setPayees(payeesList);
	}, [payees, transactions]);

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
			setClearedBalanceString("-$" + (clearedBalance / 1000000).toFixed(2));
		} else {
			setClearedBalanceString("$0.00");
		}

		// Formats uncleared balance
		if (unclearedBalance > 0) {
			setUnclearedBalanceString("$" + (unclearedBalance / 1000000).toFixed(2));
		} else if (unclearedBalance < 0) {
			setUnclearedBalanceString("-$" + (unclearedBalance / 1000000).toFixed(2));
		} else {
			setUnclearedBalanceString("$0.00");
		}

		// Formats working balance
		if (workingBalance > 0) {
			setWorkingBalanceString("$" + (workingBalance / 1000000).toFixed(2));
		} else if (workingBalance < 0) {
			setWorkingBalanceString("-$" + (workingBalance / 1000000).toFixed(2));
		} else {
			setWorkingBalanceString("$0.00");
		}
	}, [clearedBalance, unclearedBalance, workingBalance]);

	// Grouping transactions by date, including Transaction objects for initial account balances
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
		const allTransactions = transactions.concat(initialTransactions);
		console.log("amount of transactions", allTransactions.length)
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
	}, [transactions, accounts]);

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.currentTarget.value);
	};

	const transactionItems: JSX.Element[] = [];

	/*
	const transactionItems: JSX.Element[] = [];
	dateTransactionsMap.forEach((transactions, dateISOString) => {
		const dateString = new Date(dateISOString).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

		transactionItems.push(<div className={styles.date}>{dateString}</div>);
		for (let i = 0; i < transactions.length; i++) {
			const transaction = transactions[i];

			// Checks if filter includes this transaction

			// Formatting strings for transaction data
			const targetSubcategory = subcategories.find((subcategory) => subcategory.id === transaction.subcategoryID);
			const subcategoryString = targetSubcategory!.name;
			let balanceString = "";
			if (transaction.outflow) {
				balanceString = "- $" + (transaction.balance / 1000000).toFixed(2);
			} else {
				balanceString = "$" + (transaction.balance / 1000000).toFixed(2);
			}

			transactionItems.push(
				<div className={styles.transaction}>
					<div className={styles.select}>
						<span />
					</div>
					<span className={styles.payee}>{transaction.payee}</span>
					<span className={styles.subcategory}>{subcategoryString}</span>
					<span className={styles.balance}>
						{balanceString}

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
	transactionItems.push(
		<>
			<div className={styles.date}>Account Created</div>
			<div className={styles.transaction}>
				<div className={styles.select}>
					<span />
				</div>
				<span className={styles.payee}>Starting Balance</span>
				<span className={styles.subcategory}>Unassigned</span>
				<span className={classNames(styles.balance, styles.initial)}>
					{account.initialBalance > 0 ? "$" + (account.initialBalance / 1000000).toFixed(2) : "- $" + (account.initialBalance / 1000000).toFixed(2)}
					<img src="/icons/cleared.svg" alt="Cleared transaction icon" />
				</span>
			</div>
		</>
	);
	*/

	return (
		<>
			<header className={styles.header}>
				<IconButton button={{ onClick: handleBackClick }} src={"/icons/arrow-left-grey-100.svg"} altText={"Button to return to Accounts Page"} />
				<span>{}</span>
				<IconButton button={{ onClick: handleBackClick }} src={"/icons/edit-grey-100.svg"} altText={"Navigate to Edit Account Page"} />
			</header>
			<main className={styles.main}>
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
				{}
			</main>
		</>
	);
}
