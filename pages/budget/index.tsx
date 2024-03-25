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

export default function BudgetPage() {
	const [user, setUser] = useState<User | null>(null);
	const [budget, setBudget] = useState<Budget | null>(null);
	const [allocations, setAllocations] = useState<Allocation[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());

	const [unassignedKey, setUnassignedKey] = useState<0 | 1>(0);

	// Passed to DatePicker
	const handleDateChangeOnClick = (monthIndex: number, newYear: number) => {
		setMonth(monthIndex);
		setYear(newYear);
	};

	// Passed to Topbar
	const handleEditCategoriesOnClick = () => {};

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
	}, [user]);

	// Fetches subcollections when budget changes
	useEffect(() => {
		const fetchBudgetSubcollections = async () => {
			if (budget) {
				const allocationData = await getAllocations(user!.uid, budget.id);
				const categoryData = await getCategories(user!.uid, budget.id);
				const subcategoryData = await getSubcategories(user!.uid, budget.id);
				const transactionData = await getTransactions(user!.uid, budget.id);
				setAllocations(allocationData);
				setTransactions(transactionData);

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
				setCategories(categoryData);
			}
		};
		fetchBudgetSubcollections();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [budget]);

	const updateSubcategoryAllocation = async (subcategoryID: string, newBalance: number, changeInBalance: number) => {
		await updateAssignedAllocation(user!.uid, budget!.id, subcategoryID, month, year, newBalance);
		await updateUnassignedBalance(user!.uid, changeInBalance);
		budget!.unassignedBalance -= changeInBalance;
		setUnassignedKey(unassignedKey === 0 ? 1 : 0);
	};

	calculateAllocations(categories, allocations, transactions, month, year);
	const categoryItems: JSX.Element[] = [];
	if (categories.length > 0) {
		for (const category of categories) {
			if (category.id === "00000000-0000-0000-0000-000000000000") {
				continue;
			}
			categoryItems.push(<CategoryItem name={category.name} currencyString={"$"} assigned={category.assigned} available={category.available} subcategories={category.subcategories} updateSubcategoryAllocation={updateSubcategoryAllocation} />);
		}
	}

	return (
		/*
		<>
			<header className={styles.header}>
				<Topbar month={month} year={year} handleDateChangeOnClick={handleDateChangeOnClick} />
				<Unassigned currency={budget ? budget.currency : "USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} key={unassignedKey} />
			</header>
			<main className={styles.main}>{categoryItems}</main>
		</>
		*/
		<EditPage categories={categories} />
	);
}
