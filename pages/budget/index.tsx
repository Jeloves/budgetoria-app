"use client";
import "../reset.css";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
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
import { EditPage } from "@/features/edit-categories";
import { MovedSubcategoryMap } from "@/features/edit-categories/edit-page";
import { handleCategoryChanges } from "@/utils/handleCategoryChanges";
import { AccountsPage } from "@/features/accounts-page";
import classNames from "classnames";
import { AccountsHeader } from "@/features/accounts-page/accounts-header";
import { createAccount, getAccounts } from "@/firebase/accounts";

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

	const [unassignedKey, setUnassignedKey] = useState<0 | 1>(0);

	// Pages
	const [onBudgetPage, setOnBudgetPage] = useState<boolean>(true);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [onAccountsPage, setOnAccountsPage] = useState<boolean>(false);

	// Navigation Functions
	const navigateToBudgetPage = () => {
		setOnBudgetPage(true);
		setIsEditing(false);
		setOnAccountsPage(false);
	}
	const navigateToAccountsPage = () => {
		setOnBudgetPage(false);
		setIsEditing(false);
		setOnAccountsPage(true);
	};

	// Passed to DatePicker
	const handleDateChangeOnClick = (monthIndex: number, newYear: number) => {
		setMonth(monthIndex);
		setYear(newYear);
	};

	// Passed to Topbar
	const handleEditCategoriesClick = () => {
		setIsEditing(true);
	};

	// Passed to EditPage
	const handleCancelEditCategoriesClick = () => {
		setIsEditing(false);
	};
	const handleFinishEditsClick = (deletedCategoriesByID: string[], newCategories: Category[], deletedSubcategoriesByID: string[], newSubcategories: Subcategory[], movedSubcategories: MovedSubcategoryMap[]) => {
		handleCategoryChanges(user!.uid, budget!.id, allocations, clearedTransactions.concat(unclearedTransactions), deletedCategoriesByID, newCategories, deletedSubcategoriesByID, newSubcategories, movedSubcategories).then(() => {
			setIsEditing(false);
			setDataListenerKey(!dataListenerKey);
		});
	};

	// Passed to AccountsPage
	const handleConfirmNewAccount = async (newAccount: Account) => {
		await createAccount(user!.uid, budget!.id, newAccount);
	}

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
			}
		};
		fetchBudgetSubcollections();
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

	const headerContent: JSX.Element[] = [];
	const mainContent: JSX.Element[] = [];
	// User is on Budget Page
	onBudgetPage &&
		headerContent.push(
			<>
				<Topbar month={month} year={year} handleDateChangeOnClick={handleDateChangeOnClick} handleEditCategoriesClick={handleEditCategoriesClick} />
				<Unassigned currency={budget ? budget.currency : "USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} key={unassignedKey} />
			</>
		) &&
		mainContent.push(<>{categoryItems}</>);

	// User is on Accounts Page
	onAccountsPage &&
		headerContent.push(<AccountsHeader navigateToBudgetPage={navigateToBudgetPage}/>) &&
		mainContent.push(<AccountsPage accounts={accounts} handleConfirmNewAccount={handleConfirmNewAccount}/>);

	console.log("accounts", accounts)

	if (isEditing) {
		return (
			<EditPage
				userID={user ? user.uid : ""}
				budgetID={budget ? budget.id : ""}
				categoryData={[...categories]}
				subcategoryData={[...subcategories]}
				handleCancelEditCategoriesClick={handleCancelEditCategoriesClick}
				handleFinishEditsClick={handleFinishEditsClick}
			/>
		);
	} else {
		return (
			<>
				<header className={classNames(styles.header, onBudgetPage && styles.budgetPageHeader)}>
					{headerContent}
				</header>
				<main onClick={navigateToAccountsPage}  className={classNames(styles.main, onBudgetPage && styles.budgetPageContent)}>{mainContent}</main>
			</>
		);
	}
}
