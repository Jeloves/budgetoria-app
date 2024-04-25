/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./transaction-page.module.scss";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { TransactionData } from "./transaction-data/transaction-data";
import { Timestamp } from "firebase/firestore";
import classNames from "classnames";
import { createPayee, getPayees } from "@/firebase/payee";
import { getAccountNameByID, getCategoryIDBySubcategoryID, getCategoryNameByID, getCategoryNameBySubcategoryID, getSubcategoryNameByID } from "@/utils/getByID";
import { getDateStringFromTimestamp } from "@/utils/date";
import { PayeeSelectionSubpage } from "./payee-selection-subpage/payee-selection-subpage";
import { CategorySelectionSubpage } from "./category-selection-subpage/category-selection-subpage";
import { AccountSelectionSubpage } from "./account-selection-subpage/account-selection-subpage";

export type TransactionPagePropsType = {
	userID: string;
	budgetID: string;
	categories: Category[];
	subcategories: Subcategory[];
	accounts: Account[];
	transaction: Transaction;
	unassignedBalance: number;
	handleCreateTransaction: (newTransaction: Transaction) => void;
};

export function TransactionPage(props: TransactionPagePropsType) {
	const { userID, budgetID, categories, subcategories, accounts, transaction, unassignedBalance, handleCreateTransaction } = props;
	const [isApproved, setIsApproved] = useState<boolean>(false);
	const [timestamp, setTimestamp] = useState<Timestamp>(transaction.date);
	const [payee, setPayee] = useState<string>(transaction.payee);
	const [payees, setPayees] = useState<string[]>([]);
	const [memo, setMemo] = useState<string>(transaction.memo);
	const [outflow, setOutflow] = useState<boolean>(transaction.outflow);
	const [balance, setBalance] = useState<number>(transaction.balance);
	const [approval, setApproval] = useState<boolean>(transaction.approval);
	const [accountID, setAccountID] = useState<string>(transaction.accountID);
	const [subcategoryID, setSubcategoryID] = useState<string>(transaction.subcategoryID);
	const [categoryID, setCategoryID] = useState<string>(transaction.categoryID);

	// Transaction Data

	const [subpage, setSubpage] = useState<JSX.Element | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);

	const [dataListenerKey, setDataListenerKey] = useState<boolean>(false);

	// Read payees from firebase
	useEffect(() => {
		const fetchPayees = async () => {
			const payeeData = await getPayees(userID, budgetID);
			setPayees(payeeData);
		};
		fetchPayees();
	}, [budgetID, dataListenerKey, userID]);

	// Subpage Props
	const createNewPayee = (newPayee: string) => {
		// Creates payee doc in firebase
		createPayee(userID, budgetID, newPayee);
		// Sets as the selected payee
		setPayee(newPayee);
		// Resets the page
		setDataListenerKey(!dataListenerKey);
		hideSubpage();
	};
	const selectPayee = (selectedPayee: string) => {
		if (selectedPayee !== payee) {
			setPayee(selectedPayee);
		}
		hideSubpage();
	};
	const selectSubcategory = (selectedSubcategoryID: string) => {
		if (selectedSubcategoryID !== subcategoryID) {
			setSubcategoryID(selectedSubcategoryID);
			setCategoryID(getCategoryIDBySubcategoryID(selectedSubcategoryID, categories, subcategories));
		}
		hideSubpage();
	};
	const selectAccount = (selectedAccountID: string) => {
		if (selectedAccountID !== accountID) {
			setAccountID(selectedAccountID);
		}
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
	const navigateToPayeeSelectionSubpage = () => {
		showSubpage(<PayeeSelectionSubpage selectedPayee={payee} payees={payees} handleBackClick={hideSubpage} createNewPayee={createNewPayee} selectPayee={selectPayee} />);
	};
	const navigateToCategorySelectionSubpage = () => {
		showSubpage(<CategorySelectionSubpage selectedSubcategoryID={subcategoryID} categories={categories} subcategories={subcategories} unassignedBalance={unassignedBalance} handleBackClick={hideSubpage} selectSubcategory={selectSubcategory} />);
	};
	const navigateToAccountSelectionSubpage = () => {
		showSubpage(<AccountSelectionSubpage selectedAccountID={accountID} accounts={accounts} handleBackClick={hideSubpage} selectAccount={selectAccount} />);
	};
	const handleDateOnClick = () => {};


	const handleChangeApprovalState = (event: ChangeEvent<HTMLInputElement>) => {
		setIsApproved(event.target.checked);
	};
	const handleMemoOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setMemo(event.currentTarget.value);
	}

	// Formatting the transaction.balance for display
	let balanceString = "";
	let balanceClass = "";
	if (transaction.balance < 0) {
		balanceString = "-$" + (transaction.balance / 1000000).toFixed(2);
		balanceClass = "";
	} else {
		balanceString = "$" + (transaction.balance / 1000000).toFixed(2);
		balanceClass = "";
	}

	return (
		<>
			<header className={styles.header}>
				<span>Create Transaction</span>
				<button
					onClick={() => {
						handleCreateTransaction(transaction);
					}}
				>
					Finish
				</button>
			</header>
			<main className={styles.main}>
				<div className={styles.balance}>
					<div>
						<button>- Outflow</button>
						<button>- Inflow</button>
					</div>
					<input type="text" defaultValue={balanceString} className={balanceClass} />
				</div>
				<div className={styles.contentContainer}>
					<div className={styles.content}>
						<TransactionData key={0} data={payee} type="Payee" categoryName="" handleOnClick={navigateToPayeeSelectionSubpage} />
						<TransactionData
							key={1}
							data={getSubcategoryNameByID(subcategoryID, subcategories)}
							categoryName={getCategoryNameBySubcategoryID(subcategoryID, categories, subcategories)}
							type="Category"
							handleOnClick={navigateToCategorySelectionSubpage}
						/>
						<TransactionData key={2} data={getAccountNameByID(accountID, accounts)} categoryName="" type="Account" handleOnClick={navigateToAccountSelectionSubpage} />
						<TransactionData key={3} data={getDateStringFromTimestamp(timestamp)} categoryName="" type="Date" handleOnClick={handleDateOnClick} />
						<button className={styles.otherTransactionData}>
							<img src={isApproved ? "/icons/cleared.svg" : "/icons/cleared-grey-100.svg"} alt="Cleared icon" />
							<h2>Cleared</h2>
							<label className={styles.switch}>
								<input type="checkbox" onChange={handleChangeApprovalState} />
								<span className={styles.slider} />
							</label>
						</button>
						<div className={styles.otherTransactionData}>
							<img src="/icons/memo-grey-100.svg" alt="Memo icon" />
							<h2>Memo</h2>
						</div>
						<textarea className={styles.memo} placeholder="Enter memo..." onChange={handleMemoOnChange}/>
					</div>
				</div>
			</main>
			<section className={classNames(subpageClasses)}>{subpage}</section>
		</>
	);
}
