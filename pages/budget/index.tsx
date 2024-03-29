"use client";
import "../reset.css";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { auth, getUser } from "@/firebase/auth";
import { User } from "firebase/auth/cordova";
import { getSelectedBudget, updateUnassignedBalance } from "@/firebase/budgets";
import { getAllocations, updateAssignedAllocation } from "@/firebase/allocations";
import { getCategories, getSubcategories } from "@/firebase/categories";
import { getTransactions } from "@/firebase/transactions";
import { Allocation, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { Topbar } from "@/features/topbar/topbar";
import { Unassigned } from "@/features/unassigned";
import { CategoryItem } from "@/features/category-item";
import { calculateAllocations } from "../../utils/calculateAllocations";
import { EditPage } from "@/features/edit-categories";
import { MovedSubcategoryMap } from "@/features/edit-categories/edit-page";
import { handleCategoryChanges } from "@/utils/handleCategoryChanges";

export default function BudgetPage() {
	const [user, setUser] = useState<User | null>(null);
	const [budget, setBudget] = useState<Budget | null>(null);
	const [allocations, setAllocations] = useState<Allocation[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [incompleteTransactions, setIncompleteTransactions] = useState<Transaction[]>([]);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [dataListenerKey, setDataListenerKey] = useState<boolean>(false);

	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());

	const [unassignedKey, setUnassignedKey] = useState<0 | 1>(0);

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
		handleCategoryChanges(user!.uid, budget!.id, allocations, transactions.concat(incompleteTransactions), deletedCategoriesByID, newCategories, deletedSubcategoriesByID, newSubcategories, movedSubcategories).then(() => {
			setIsEditing(false)
			setDataListenerKey(!dataListenerKey);
		});
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
		const fetchBudgetSubcollections = async () => {
			if (budget) {
				const allocationData = await getAllocations(user!.uid, budget.id);
				const categoryData = await getCategories(user!.uid, budget.id);
				const subcategoryData = await getSubcategories(user!.uid, budget.id);
				const transactionData = await getTransactions(user!.uid, budget.id);

				const completeTransactionsData: Transaction[] = [];
				const incompleteTransactionsData: Transaction[] = [];
				for (const transaction of transactionData) {
					if (transaction.categoryID === "" || transaction.subcategoryID === "") {
						incompleteTransactionsData.push(transaction);
					} else {
						completeTransactionsData.push(transaction);
					}
				}
				

				for (const category of categoryData) {
					if (category.id === "00000000-0000-0000-0000-000000000000") {
						continue;
					}
					for (const subcategory of subcategoryData) {
						if (category.id === subcategory.categoryID) {
							category.subcategories.push(subcategory);
						}
					}
					category.subcategories.sort((a, b) => {
						if (a.name < b.name) {
							return -1;
						} else if (a.name > b.name) {
							return 1;
						} else {
							return 0;
						}
					});
				}
				categoryData.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else {
						return 0;
					}
				});
				calculateAllocations(categoryData, allocationData, completeTransactionsData, month, year);

				setCategories(categoryData);
				setTransactions(completeTransactionsData);
				setIncompleteTransactions(incompleteTransactions);
				setAllocations(allocationData);
			}
		};
		fetchBudgetSubcollections()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [budget, dataListenerKey]);

	const updateSubcategoryAllocation = async (subcategoryID: string, newBalance: number, changeInBalance: number) => {
		await updateAssignedAllocation(user!.uid, budget!.id, subcategoryID, month, year, newBalance);
		await updateUnassignedBalance(user!.uid, -changeInBalance);
		budget!.unassignedBalance -= changeInBalance;
		setUnassignedKey(unassignedKey === 0 ? 1 : 0);
	};

	const categoryItems: JSX.Element[] = [];
	if (categories.length > 0) {
		for (const category of categories) {
			if (category.id === "00000000-0000-0000-0000-000000000000") {
				continue;
			}
			categoryItems.push(<CategoryItem name={category.name} currencyString={"$"} assigned={category.assigned} available={category.available} subcategories={category.subcategories} updateSubcategoryAllocation={updateSubcategoryAllocation} />);
		}
	}

	const mainPage = (
		<>
			<header className={styles.header}>
				<Topbar month={month} year={year} handleDateChangeOnClick={handleDateChangeOnClick} handleEditCategoriesClick={handleEditCategoriesClick} />
				<Unassigned currency={budget ? budget.currency : "USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} key={unassignedKey} />
			</header>
			<main className={styles.main}>{categoryItems}</main>
		</>
	);

	if (isEditing) {
		return <EditPage userID={user ? user.uid : ""} budgetID={budget ? budget.id : ""} categoryData={[...categories]} handleCancelEditCategoriesClick={handleCancelEditCategoriesClick} handleFinishEditsClick={handleFinishEditsClick}/>;
	} else {
		return (
			<>
				<header className={styles.header}>
					<Topbar month={month} year={year} handleDateChangeOnClick={handleDateChangeOnClick} handleEditCategoriesClick={handleEditCategoriesClick} />
					<Unassigned currency={budget ? budget.currency : "USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} key={unassignedKey} />
				</header>
				<main className={styles.main}>{categoryItems}</main>
			</>
		);
	}
}
