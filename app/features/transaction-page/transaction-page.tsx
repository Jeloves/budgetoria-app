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
import { DateSelectionSubpage } from "./date-selection-subpage/date-selection-subpage";
import { formatCurrencyBasedOnOutflow } from "@/utils/currency";
import { getUnassignedBalance } from "@/firebase/budgets";
import { IconButton } from "../ui";

export type TransactionPagePropsType = {
	userID: string;
	budgetID: string;
	categories: Category[];
	subcategories: Subcategory[];
	accounts: Account[];
	transaction: Transaction;
	isCreatingTransaction: boolean;
	handleCreateTransaction: (newTransaction: Transaction) => void;
	hideTransactionPage: null | (() => void);
};

export function TransactionPage(props: TransactionPagePropsType) {
	const { userID, budgetID, categories, subcategories, accounts, transaction, isCreatingTransaction, handleCreateTransaction, hideTransactionPage } = props;
	const [unassignedBalance, setUnassignedBalance] = useState<number>(0);
	const [dataListenerKey, setDataListenerKey] = useState<boolean>(false);
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

	// Header Display
	const [headerClasses, setHeaderClasses] = useState<string[]>([styles.header]);

	// Balance Display
	const [balanceRenderKey, setBalanceRenderKey] = useState<1 | 0>(0);
	const [balanceClasses, setBalanceClasses] = useState<string[]>([styles.balance, outflow ? "" : styles.inflow]);
	const [balanceString, setBalanceString] = useState<string>(formatCurrencyBasedOnOutflow(balance, outflow));

	// Subpage useStates
	const [subpage, setSubpage] = useState<JSX.Element | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);
	const [isCalendarShown, setIsCalendarShown] = useState<boolean>(false);
	const [calendarClasses, setCalendarClasses] = useState<string[]>([styles.calendar]);

	// Read payees from firebase
	useEffect(() => {
		const fetchPayees = async () => {
			const payeeData = await getPayees(userID, budgetID);
			setPayees(payeeData);
		};
		fetchPayees();
	}, [budgetID, dataListenerKey, userID]);

	// Read unassigned balance from firebase
	useEffect(() => {
		const fetchUnassignedBalance = async () => {
			const unassigned = await getUnassignedBalance(userID, budgetID);
			setUnassignedBalance(unassigned);
		};
		fetchUnassignedBalance();
	}, [budgetID, dataListenerKey, userID]);

	// Styles header
	useEffect(() => {
		isCreatingTransaction ? setHeaderClasses([styles.header, styles.newTransactionHeader]) : setHeaderClasses([styles.header, styles.existingTransactionHeader]);
	}, [isCreatingTransaction]);

	// Updates Transaction Data
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
	const selectDate = (newDate: Date) => {
		const newTimestamp = Timestamp.fromDate(newDate);
		if (newTimestamp !== timestamp) {
			setTimestamp(newTimestamp);
		}
		hideDateSelection();
	};
	const handleApprovalOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		setApproval(event.target.checked);
	};
	const handleMemoOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setMemo(event.currentTarget.value);
	};
	// Updates Transaction balance
	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.currentTarget.blur();
		}
	};
	const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		let value = event.target.value;

		// Removes non-number characters
		const nonCurrencyRegex = /[^0-9.]/g;
		value = value.replace(nonCurrencyRegex, "");

		// If still not a valid number, sets to 0
		const isValidNumber = !isNaN(parseFloat(value));
		const newBalance = isValidNumber ? parseFloat(value) * 1000000 : 0;

		setBalance(newBalance);
		setBalanceString(formatCurrencyBasedOnOutflow(newBalance, outflow));
		setBalanceRenderKey(balanceRenderKey === 0 ? 1 : 0);
	};

	// Subpage Navigation
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
	const showDateSelection = () => {
		setCalendarClasses([styles.calendar, styles.showCalendar]);
		setIsCalendarShown(true);
	};
	const hideDateSelection = () => {
		setCalendarClasses([styles.calendar, styles.hideCalendar]);
		setIsCalendarShown(false);
	};

	return (
		<>
			<header className={classNames(headerClasses)}>
				{!isCreatingTransaction && <IconButton button={{ onClick: hideTransactionPage! }} src={"/icons/arrow-left-grey-100.svg"} altText={"Navigate back to AccountTransactionsSubpage"} />}
				<span>{isCreatingTransaction ? "Create Transaction" : "Transaction"}</span>
				<button
					onClick={() => {
						handleCreateTransaction(new Transaction(transaction.id, timestamp, payee, memo, outflow, balance, approval, accountID, categoryID, subcategoryID));
					}}
				>
					Finish
				</button>
			</header>
			<main className={styles.main}>
				<div className={classNames(balanceClasses)}>
					<div>
						<button
							className={outflow ? styles.flow : ""}
							onClick={() => {
								setOutflow(true);
								setBalanceClasses([styles.balance]);
							}}
						>
							- Outflow
						</button>
						<button
							className={outflow ? "" : styles.flow}
							onClick={() => {
								setOutflow(false);
								setBalanceClasses([styles.balance, styles.inflow]);
							}}
						>
							+ Inflow
						</button>
					</div>
					<input key={balanceRenderKey} type="text" defaultValue={balanceString} onKeyDown={handleEnterKeyDown} onBlur={handleInputBlur} />
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
						<TransactionData key={3} data={getDateStringFromTimestamp(timestamp)} categoryName="" type="Date" handleOnClick={isCalendarShown ? hideDateSelection : showDateSelection} />
						<div className={classNames(calendarClasses)}>
							<DateSelectionSubpage date={timestamp.toDate()} handleBackClick={hideDateSelection} selectDate={selectDate} />
							<hr className={styles.border} />
						</div>
						<button className={styles.otherTransactionData}>
							<img src={approval ? "/icons/cleared.svg" : "/icons/cleared-grey-100.svg"} alt="Cleared icon" />
							<h2>Cleared</h2>
							<label className={styles.switch}>
								<input type="checkbox" onChange={handleApprovalOnChange} />
								<span className={styles.slider} />
							</label>
						</button>
						<div className={styles.otherTransactionData}>
							<img src="/icons/memo-grey-100.svg" alt="Memo icon" />
							<h2>Memo</h2>
						</div>
						<textarea className={styles.memo} placeholder="Enter memo..." onChange={handleMemoOnChange} />
					</div>
				</div>
			</main>
			<section className={classNames(subpageClasses)}>{subpage}</section>
		</>
	);
}
