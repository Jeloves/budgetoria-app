"use client";
import "../reset.css";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/auth";
import { User } from "firebase/auth/cordova";
import { getSelectedBudget, getUnassignedBalance, updateUnassignedBalance } from "@/firebase/budgets";
import { getAllocations, updateAssignedAllocation } from "@/firebase/allocations";
import { getCategories, getSubcategories } from "@/firebase/categories";
import { createTransaction, getTransactions } from "@/firebase/transactions";
import { Account, Allocation, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { Topbar } from "@/features/topbar/topbar";
import { Unassigned } from "@/features/unassigned";
import { CategoryItem } from "@/features/category-item";
import { EditPage } from "@/features/edit-page";
import { AccountsPage } from "@/features/accounts-page";
import classNames from "classnames";
import { createAccount, getAccounts } from "@/firebase/accounts";
import { NavigationBar } from "@/features/navigation-bar";
import { getDateInterval } from "@/utils/getDateInterval";
import { DateIntervalType } from "@/features/date-picker/date-picker";
import { Options } from "@/features/options";
import { TransactionPage } from "@/features/transaction-page/transaction-page";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";

export default function BudgetPage() {
	const [user, setUser] = useState<User | null>(null);
	const [budget, setBudget] = useState<Budget | null>(null);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [allocations, setAllocations] = useState<Allocation[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
	const [clearedTransactions, setClearedTransactions] = useState<Transaction[]>([]);
	const [unclearedTransactions, setUnclearedTransactions] = useState<Transaction[]>([]);

	const [dataListenerKey, setDataListenerKey] = useState<boolean>(false);

	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());
	const [dateInterval, setDateInterval] = useState<DateIntervalType>({
		minDate: new Date(),
		maxDate: new Date(),
	});

	const [unassignedKey, setUnassignedKey] = useState<0 | 1>(0);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [optionsClassNames, setOptionsClassNames] = useState<string[]>([styles.options]);

	// Pages
	const [page, setPage] = useState<"Budget" | "Edit" | "Accounts" | "Create Transaction">("Budget");

	// Navigation Functions
	const showOptions = () => {
		setOptionsClassNames([styles.options, styles.show]);
	};
	const hideOptions = () => {
		setOptionsClassNames([styles.options, styles.hide]);
	};
	const navigateToBudgetPage = () => {
		setPage("Budget");
	};
	const navigateToAccountsPage = () => {
		setPage("Accounts");
	};
	const navigateToEditPage = () => {
		setPage("Edit");
	};
	const navigateToCreateTransactionPage = () => {
		setPage("Create Transaction");
	};

	// Passed to DatePicker
	const handleDateChangeOnClick = (monthIndex: number, newYear: number) => {
		setMonth(monthIndex);
		setYear(newYear);
	};

	// Passed to Topbar
	const handleEditCategoriesClick = () => {
		navigateToEditPage();
	};

	// Passed to EditPage
	const handleFinishEdits = () => {
		setDataListenerKey(!dataListenerKey);
		navigateToBudgetPage();
	};

	// Passed to AccountsPage
	const handleConfirmNewAccount = async (newAccount: Account) => {
		await createAccount(user!.uid, budget!.id, newAccount);
		// TODO: update unassigned balance
	};

	// Passed to CreateTransactionPage
	const handleCreateTransaction = (newTransaction: Transaction) => {
		if (newTransaction.categoryID && newTransaction.accountID && newTransaction.date) {
			createTransaction(user!.uid, budget!.id, newTransaction);
			// TODO: update unassigned balance
			navigateToBudgetPage();
		} else {
			alert("A transaction requires a selected category, account, and date.")
		}
	};

	// Sets user
	useEffect(() => {
		auth.onAuthStateChanged((user: User | null) => {
			setUser(user);
		});
	});

	// Fetches selected budget when user logs in
	useEffect(() => {
		const fetchBudgetData = async () => {
			if (user) {
				const data = await getSelectedBudget(user.uid);
				setBudget(data);
			}
		};
		fetchBudgetData();
	}, [user, dataListenerKey]);

	// Fetches subcollections when budget changes
	useEffect(() => {
		setIsLoading(true);
		const fetchBudgetSubcollections = async () => {
			if (budget) {
				const accountsData = await getAccounts(user!.uid, budget.id);

				// Allocation and transaction data are filtered by month & year.
				const allocationData = await getAllocations(user!.uid, budget.id, month, year);
				const transactionData = await getTransactions(user!.uid, budget.id, month, year);

				const categoryData = await getCategories(user!.uid, budget.id);
				const subcategoryData = await getSubcategories(user!.uid, budget.id);
				// Sorting categories and subcategories alphabetically.
				categoryData.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else {
						return 0;
					}
				});
				subcategoryData.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else {
						return 0;
					}
				});

				// Sorting cleared vs uncleared transactions.
				const clearedTransactionData: Transaction[] = [];
				const unclearedTransactionData: Transaction[] = [];
				for (const transaction of transactionData) {
					if (transaction.categoryID === "" || transaction.subcategoryID === "" || !transaction.approval) {
						unclearedTransactionData.push(transaction);
					} else {
						clearedTransactionData.push(transaction);
					}
				}
				setAccounts(accountsData);
				setCategories(categoryData);
				setSubcategories(subcategoryData);
				setAllocations(allocationData);
				setClearedTransactions(clearedTransactionData);
				setUnclearedTransactions(unclearedTransactions);
				setIsLoading(false);
				setDateInterval(getDateInterval(user!.uid, budget.id, budget.dateCreated));
			}
		};
		fetchBudgetSubcollections();
		navigateToBudgetPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [budget, dataListenerKey]);

	const updateSubcategoryAllocation = async (subcategoryID: string, newBalance: number, changeInBalance: number) => {
		await updateAssignedAllocation(user!.uid, budget!.id, subcategoryID, month, year, newBalance);
		await updateUnassignedBalance(user!.uid, -changeInBalance);
		budget!.unassignedBalance = await getUnassignedBalance(user!.uid, budget!.id);
		setUnassignedKey(unassignedKey === 0 ? 1 : 0);
	};

	const categoryItems: JSX.Element[] = [];
	if (categories.length > 0) {
		for (let i = 0; i < categories.length; i++) {
			const category = categories[i];

			// Filtering necessary props for this CategoryItem.
			const filteredSubcategories = subcategories.filter((subcategory) => {
				return subcategory.categoryID === category.id;
			});
			const filteredAllocations = allocations.filter((allocation) => {
				return filteredSubcategories.some((subcategory) => {
					return subcategory.id === allocation.subcategoryID;
				});
			});
			const filteredTransactions = clearedTransactions.filter((transaction) => {
				return transaction.categoryID === category.id;
			});

			categoryItems.push(
				<CategoryItem key={i} currencyString={"$"} category={category} subcategories={filteredSubcategories} allocations={filteredAllocations} transactions={filteredTransactions} updateSubcategoryAllocation={updateSubcategoryAllocation} />
			);
		}
	}

	const pageContent: JSX.Element[] = [];

	// User is on Budget Page
	page === "Budget" &&
		pageContent.push(
			<header key={unassignedKey} className={styles.budgetPageHeader}>
				<Topbar month={month} year={year} dateInterval={dateInterval} handleDateChangeOnClick={handleDateChangeOnClick} handleEditCategoriesClick={handleEditCategoriesClick} handleShowOptions={showOptions} />
				<Unassigned currency={budget ? budget.currency : "USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} />
			</header>
		) &&
		pageContent.push(
			<main key={"budgetPageMain"} className={classNames(styles.main, styles.budgetPageContent)}>
				{categoryItems}
			</main>
		);

	// User is on Accounts Page
	page === "Accounts" &&
		pageContent.push(
			<>
				<AccountsPage key={"accountsPage"} accounts={accounts} handleConfirmNewAccount={handleConfirmNewAccount} />
			</>
		);

	// User is on Edit Page
	page === "Edit" &&
		pageContent.push(
			<>
				<EditPage key={"editPage"} userID={user ? user.uid : ""} budgetID={budget ? budget.id : ""} categories={categories} subcategories={subcategories} handleFinishEdits={handleFinishEdits} />
			</>
		);

	// User is on Create Transaction Page
	page === "Create Transaction" &&
		pageContent.push(
			<>
				<TransactionPage
					key={"createTransactionPage"}
					userID={user ? user.uid : ""}
					budgetID={budget ? budget.id : ""}
					categories={categories}
					subcategories={subcategories}
					accounts={accounts}
					transaction={new Transaction(uuidv4(), Timestamp.fromDate(new Date()), "", "", true, 0, false, "", "", "")}
					unassignedBalance={budget ? budget.unassignedBalance : 0}
					handleCreateTransaction={handleCreateTransaction}
				/>
			</>
		);

	if (isLoading) {
		return (
			<div className={styles.loading}>
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<img src="/icons/loading.svg" alt="Loading screen icon" />
			</div>
		);
	} else {
		return (
			<>
				<section className={classNames(optionsClassNames)}>
					<Options handleHideOptions={hideOptions} />
				</section>
				{pageContent}
				<NavigationBar selectedPage={page} navigateToBudget={navigateToBudgetPage} navigateToCreateTransaction={navigateToCreateTransactionPage} navigateToAccounts={navigateToAccountsPage} />
			</>
		);
	}
}
