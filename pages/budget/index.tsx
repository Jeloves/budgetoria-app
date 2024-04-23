"use client";
import "../reset.css";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { auth, getUser } from "@/firebase/auth";
import { User } from "firebase/auth/cordova";
import { getSelectedBudget, getUnassignedBalance, updateUnassignedBalance } from "@/firebase/budgets";
import { getAllocations, updateAssignedAllocation } from "@/firebase/allocations";
import { getCategories, getSubcategories } from "@/firebase/categories";
import { getTransactions } from "@/firebase/transactions";
import { Account, Allocation, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { Topbar } from "@/features/topbar/topbar";
import { Unassigned } from "@/features/unassigned";
import { CategoryItem } from "@/features/category-item";
import { EditPage } from "@/features/edit-page";
import { MovedSubcategoryMap, UpdatedCategoryNames } from "@/features/edit-page/edit-page";
import { handleCategoryChanges } from "@/utils/handleCategoryChanges";
import { AccountsPage } from "@/features/accounts-page";
import classNames from "classnames";
import { AccountsHeader } from "@/features/accounts-page/accounts-header";
import { createAccount, getAccounts } from "@/firebase/accounts";
import { NavigationBar } from "@/features/navigation-bar";
import { EditPageHeader } from "@/features/edit-page/edit-page-header/edit-page-header";
import { getDateInterval } from "@/utils/getDateInterval";
import { DateIntervalType } from "@/features/date-picker/date-picker";
import { MoveSubcategoryHeader } from "@/features/edit-page/move-subcategory-subpage/move-subcategory-header";
import { MoveSubcategorySubpage } from "@/features/edit-page/move-subcategory-subpage/move-subcategory-subpage";
import { Options } from "@/features/options";
import { cloneDeep, cloneDeepWith } from "lodash";

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
	const [onBudgetPage, setOnBudgetPage] = useState<boolean>(true);
	const [onEditPage, setOnEditPage] = useState<boolean>(false);
	const [onAccountsPage, setOnAccountsPage] = useState<boolean>(false);

	// Sub Pages
	const [onSubpage, setOnSubpage] = useState<boolean>(false);
	const [subpageClassNames, setSubpageClassNames] = useState<string[]>([styles.subpage]);
	const [subpageHeader, setSubpageHeader] = useState<JSX.Element | null>(null);
	const [subpageMain, setSubpageMain] = useState<JSX.Element | null>(null);

	// Navigation Functions
	const showOptions = () => {
		setOptionsClassNames([styles.options, styles.show]);
	};
	const hideOptions = () => {
		setOptionsClassNames([styles.options, styles.hide]);
	};
	const navigateToBudgetPage = () => {
		setOnBudgetPage(true);
		setOnEditPage(false);
		setOnAccountsPage(false);
	};
	const navigateToAccountsPage = () => {
		setOnBudgetPage(false);
		setOnEditPage(false);
		setOnAccountsPage(true);
	};
	const navigateToEditPage = () => {
		setOnBudgetPage(false);
		setOnEditPage(true);
		setOnAccountsPage(false);
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
	}

	// Passed to AccountsPage
	const handleConfirmNewAccount = async (newAccount: Account) => {
		await createAccount(user!.uid, budget!.id, newAccount);
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

	const pageHeader: JSX.Element[] = [];
	const pageMain: JSX.Element[] = [];

	const pageContent: JSX.Element[] = [];

	// User is on Budget Page
	onBudgetPage &&
		pageContent.push(
			<header className={styles.budgetPageHeader}>
				<Topbar month={month} year={year} dateInterval={dateInterval} handleDateChangeOnClick={handleDateChangeOnClick} handleEditCategoriesClick={handleEditCategoriesClick} handleShowOptions={showOptions} />
				<Unassigned currency={budget ? budget.currency : "USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} key={unassignedKey} />
			</header>
		) &&
		pageContent.push(<main className={classNames(styles.main, styles.budgetPageContent)}>{categoryItems}</main>);

	// User is on Accounts Page
	onAccountsPage && pageHeader.push(<AccountsHeader />) && pageMain.push(<AccountsPage accounts={accounts} handleConfirmNewAccount={handleConfirmNewAccount} />);

	// User is on Edit Page
	onEditPage &&
		pageContent.push(
			<main className={styles.main}>
				<EditPage
					userID={user ? user.uid : ""}
					budgetID={budget ? budget.id : ""}
					categories={categories}
					subcategories={subcategories}
					handleFinishEdits={handleFinishEdits}
				/>
			</main>
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
				<NavigationBar
					navigateToBudget={navigateToBudgetPage}
					navigateToCreateTransaction={() => {
						alert("Creating new transaction");
					}}
					navigateToAccounts={navigateToAccountsPage}
				/>

				{onSubpage && (
					<section className={classNames(subpageClassNames)}>
						<header className={styles.header}>{subpageHeader}</header>
						<main className={styles.main}>{subpageMain}</main>
					</section>
				)}
			</>
		);
	}
}
