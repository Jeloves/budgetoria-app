import { Account, Subcategory, Transaction } from "@/firebase/models";
import styles from "./account-transactions-subpage.module.scss";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { IconButton } from "@/features/ui";

export type AccountTransactionsSubpagePropsType = {
	subcategories: Subcategory[];
	accounts: Account[];
	transactions: Transaction[];
	handleBackClick: () => void;
};

type DateTransactionsMapType = Map<string, Transaction[]>;

export function AccountTransactionsSubpage(props: AccountTransactionsSubpagePropsType) {
	const { account, subcategories, handleBackClick } = props;
	const [clearedTransactions, setClearedTransactions] = useState<Transaction[]>(props.clearedTransactions);
	const [unclearedTransactions, setUnclearedTransactions] = useState<Transaction[]>(props.unclearedTransactions);
	const [clearedTransactionBalanceString, setClearedTransactionBalanceString] = useState<string>("$0.00");
	const [unclearedTransactionBalanceString, setUnclearedTransactionBalanceString] = useState<string>("$0.00");
	const [accountBalanceString, setAccountBalanceString] = useState<string>("$0.00");
	const [dateTransactionsMap, setDateTransactionsMap] = useState<DateTransactionsMapType>(new Map());
	const [payees, setPayees] = useState<string[]>([]);
	const [filter, setFilter] = useState<string>("");

	// Generates list of payees included in transactions
	useEffect(() => {
		const payeeList: string[] = [];
		for (let transaction of clearedTransactions) {
			if (!payeeList.includes(transaction.payee)) {
				payeeList.push(transaction.payee);
			}
		}
		for (let transaction of unclearedTransactions) {
			if (!payeeList.includes(transaction.payee)) {
				payeeList.push(transaction.payee);
			}
		}
		setPayees(payeeList);
	}, [clearedTransactions, unclearedTransactions])

	// Calculates cleared transaction balance.
	useEffect(() => {
		let totalClearedBalance = account.initialBalance;
		for (const transaction of clearedTransactions) {
			if (transaction.outflow) {
				totalClearedBalance -= transaction.balance;
			} else {
				totalClearedBalance += transaction.balance;
			}
		}
		if (totalClearedBalance > 0) {
			setClearedTransactionBalanceString("$" + (totalClearedBalance / 1000000).toFixed(2));
		} else {
			setClearedTransactionBalanceString("- $" + (totalClearedBalance / -1000000).toFixed(2));
		}
	}, [account.initialBalance, clearedTransactions]);

	// Calculates uncleared transaction balance.
	useEffect(() => {
		let totalUnclearedBalance = 0;
		for (const transaction of unclearedTransactions) {
			if (transaction.outflow) {
				totalUnclearedBalance -= transaction.balance;
			} else {
				totalUnclearedBalance += transaction.balance;
			}
		}
		if (totalUnclearedBalance > 0) {
			setUnclearedTransactionBalanceString("$" + (totalUnclearedBalance / 1000000).toFixed(2));
		} else {
			setUnclearedTransactionBalanceString("- $" + (totalUnclearedBalance / -1000000).toFixed(2));
		}
	}, [unclearedTransactions]);

	// Calculates total account balance.
	useEffect(() => {
		let totalBalance = account.initialBalance;
		for (const transaction of clearedTransactions.concat(unclearedTransactions)) {
			if (transaction.outflow) {
				totalBalance -= transaction.balance;
			} else {
				totalBalance += transaction.balance;
			}
		}
		if (totalBalance > 0) {
			setAccountBalanceString("$" + (totalBalance / 1000000).toFixed(2));
		} else {
			setAccountBalanceString("- $" + (totalBalance / -1000000).toFixed(2));
		}
	}, [account.initialBalance, clearedTransactions, unclearedTransactions]);

	// Groups all transactions by date
	useEffect(() => {
		// Ordering all transactions by date in descending order, into a single array
		const allTransactions = clearedTransactions.concat(unclearedTransactions);
		allTransactions.sort((a, b) => b.date.toMillis() - a.date.toMillis());

		const newDateTransactionsMap: Map<string, Transaction[]> = new Map();
		for (const transaction of allTransactions) {
			const dateISOString = transaction.date.toDate().toISOString();
			if (newDateTransactionsMap.has(dateISOString)) {
				const currentTransactions = [...newDateTransactionsMap.get(dateISOString)!];
				currentTransactions!.push(transaction);
				newDateTransactionsMap.set(dateISOString, currentTransactions!);
			} else {
				newDateTransactionsMap.set(dateISOString, [transaction]);
			}
		}
		setDateTransactionsMap(newDateTransactionsMap);
	}, [clearedTransactions, unclearedTransactions]);

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const currentFilter = event.currentTarget.value;
		setFilter(event.currentTarget.value);
	};

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
	// Starting balance item
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
					{/*eslint-disable-next-line @next/next/no-img-element*/}
					<img src="/icons/cleared.svg" alt="Cleared transaction icon" />
				</span>
			</div>
		</>
	);

	return (
		<>
			<header className={styles.header}>
				<IconButton button={{ onClick: handleBackClick }} src={"/icons/arrow-left-grey-100.svg"} altText={"Button to return to Accounts Page"} />
				<span>{account.name}</span>
				<IconButton button={{ onClick: handleBackClick }} src={"/icons/edit-grey-100.svg"} altText={"Navigate to Edit Account Page"} />
			</header>
			<main className={styles.main}>
				<div className={styles.balances}>
					<span className={styles.totalLabel}>Total</span>
					<span className={styles.totalBalance}>{accountBalanceString}</span>
					<div className={styles.cleared}>
						Cleared
						<span>{clearedTransactionBalanceString}</span>
					</div>
					<div className={styles.uncleared}>
						Uncleared
						<span>{unclearedTransactionBalanceString}</span>
					</div>
				</div>
				<div className={styles.filter}>
					{/*eslint-disable-next-line @next/next/no-img-element */}
					<img src="/icons/search-grey-300.svg" alt="Search icon" />
					<input type="text" placeholder="Search Transactions" onChange={handleFilterChange} />
				</div>
				{transactionItems}
			</main>
		</>
	);
}
