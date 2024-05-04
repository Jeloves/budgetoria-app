"use client";
import "../reset.css";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/auth";
import { User } from "firebase/auth/cordova";
import { getSelectedBudget, getUnassignedBalance, updateUnassignedBalance } from "@/firebase/budgets";
import { getAllocationsByDate, updateAssignedAllocation } from "@/firebase/allocations";
import { getCategories, getSubcategories } from "@/firebase/categories";
import { createTransaction, getTransactionsByDate } from "@/firebase/transactions";
import { Account, Allocation, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { Topbar } from "@/features/topbar/topbar";
import { Unassigned } from "@/features/unassigned";
import { CategoryItem } from "@/features/category-item";
import { EditPage } from "@/features/edit-page";
import { AccountsPage } from "@/features/accounts-page";
import classNames from "classnames";
import { getAccounts } from "@/firebase/accounts";
import { NavigationBar } from "@/features/navigation-bar";
import { getDateInterval } from "@/utils/getDateInterval";
import { DateIntervalType } from "@/features/date-picker/date-picker";
import { Options } from "@/features/options";
import { TransactionPage } from "@/features/transaction-page/transaction-page";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";
import { sortCategoriesAlphabetically, sortSubcategoriesAlphabetically } from "@/utils/sorting";
import { CategoryAllocation, assignAllocations } from "@/utils/allocate";

export default function BudgetPage() {
	const [user, setUser] = useState<User | null>(null);
	const [budget, setBudget] = useState<Budget | null>(null);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [allocations, setAllocations] = useState<Allocation[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [clearedTransactions, setClearedTransactions] = useState<Transaction[]>([]);
	const [unclearedTransactions, setUnclearedTransactions] = useState<Transaction[]>([]);
	const [categoryAllocations, setCategoryAllocations] = useState<CategoryAllocation[]>([]);

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

	// Fetches accounts
	useEffect(() => {
		if (budget) {
			const fetch = async () => {
				const accountData = await getAccounts(user!.uid, budget.id);
				setAccounts(accountData);
			};
			fetch();
		}
	}, [budget, user]);

	// Fetches categories, subcategories, and assigns allocations
	const [categoriesDataKey, setCategoriesDataKey] = useState<boolean>(false);
	const refreshCategories = () => {
		setCategoriesDataKey(!categoriesDataKey);
	};
	useEffect(() => {
		if (budget && user) {
			setIsLoading(true);
			const fetch = async () => {
				// Fetches and sorts categories and subcategories
				const categoryData = await getCategories(user!.uid, budget.id);
				const subcategoryData = await getSubcategories(user!.uid, budget.id);
				sortCategoriesAlphabetically(categoryData);
				sortSubcategoriesAlphabetically(subcategoryData);
				setCategories(categoryData);
				setSubcategories(subcategoryData);

				// Fetches allocations of current date
				const allocationData = await getAllocationsByDate(user.uid, budget.id, month, year);
				setAllocations(allocationData);

				// Fetches transactions of current date
				const transactionsData = await getTransactionsByDate(user.uid, budget.id, month, year);
				setTransactions(transactionsData);

				// Calculating category and subcategory allocations
				const categoryAllocationsData: CategoryAllocation[] = [];
				for (const category of categoryData) {
					const filteredTransactions = transactionsData.filter((transaction) => transaction.categoryID === category.id);
					const filteredSubcategories = subcategoryData.filter((subcategory) => subcategory.categoryID === category.id);
					const filteredAllocations = allocationData.filter((allocation) => {
						return filteredSubcategories.some((subcategory) => subcategory.id === allocation.id);
					});
					const categoryAllocation = assignAllocations(user.uid, budget.id, category, filteredSubcategories, filteredAllocations, filteredTransactions, year, month);
					categoryAllocationsData.push(categoryAllocation);
				}
				setCategoryAllocations(categoryAllocationsData);

				setIsLoading(false);
			};
			fetch();
		}
	}, [budget, categoriesDataKey, month, user, year]);

	// Fetches subcollections when budget changes
	useEffect(() => {
		const fetchBudgetSubcollections = async () => {
			if (budget) {
				// Allocation and transaction data are filtered by month & year.
				const transactionData = await getTransactionsByDate(user!.uid, budget.id, month, year);

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
				setClearedTransactions(clearedTransactionData);
				setUnclearedTransactions(unclearedTransactions);
				setDateInterval(getDateInterval(user!.uid, budget.id, budget.dateCreated));
			}
		};
		fetchBudgetSubcollections();
		navigateToBudgetPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [budget, dataListenerKey]);

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
		refreshCategories();
		navigateToBudgetPage();
	};

	// Passed to CreateTransactionPage
	const handleCreateTransaction = (newTransaction: Transaction) => {
		if (newTransaction.categoryID && newTransaction.accountID && newTransaction.date) {
			createTransaction(user!.uid, budget!.id, newTransaction);
			// TODO: update unassigned balance
			navigateToBudgetPage();
		} else {
			alert("A transaction requires a selected category, account, and date.");
		}
	};

	const updateSubcategoryAllocation = async (subcategoryID: string, newBalance: number, changeInBalance: number) => {
		await updateAssignedAllocation(user!.uid, budget!.id, subcategoryID, month, year, newBalance);
		await updateUnassignedBalance(user!.uid, -changeInBalance);
		budget!.unassignedBalance = await getUnassignedBalance(user!.uid, budget!.id);
		setUnassignedKey(unassignedKey === 0 ? 1 : 0);
	};

	const categoryItems: JSX.Element[] = [];
	if (categories.length > 0) {
		for (let i = 0; i < categoryAllocations.length; i++) {
			const categoryAllocation = categoryAllocations[i];

			categoryItems.push(<CategoryItem key={i} categoryAllocation={categoryAllocation} updateSubcategoryAllocation={updateSubcategoryAllocation} />);
		}
	}

	const pageContent: JSX.Element[] = [];

	// User is on Budget Page
	page === "Budget" &&
		pageContent.push(
			<header key={unassignedKey} className={styles.budgetPageHeader}>
				<Topbar month={month} year={year} dateInterval={dateInterval} handleDateChangeOnClick={handleDateChangeOnClick} handleEditCategoriesClick={handleEditCategoriesClick} handleShowOptions={showOptions} />
				<Unassigned currency={"USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} />
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
				<AccountsPage key={"accountsPage"} userID={user!.uid} budgetID={budget!.id} categories={categories} subcategories={subcategories} />
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
					isCreatingTransaction={true}
					handleCreateTransaction={handleCreateTransaction}
					hideTransactionPage={null}
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
