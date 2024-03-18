"use client";
import "../reset.css";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { auth, getUser } from "@/firebase/auth";
import { User } from "firebase/auth/cordova";
import { getSelectedBudget } from "@/firebase/budgets";
import { getAllocations } from "@/firebase/allocations";
import { getCategories, getSubcategories } from "@/firebase/categories";
import { getTransactions } from "@/firebase/transactions";
import { Allocation, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { Topbar } from "@/features/topbar/topbar";
import { Unassigned } from "@/features/unassigned";
import { CategoryItem } from "@/features/category-item";
import { calculateAllocations } from "./scripts/calculateAllocations";

export default function BudgetPage() {
	const [user, setUser] = useState<User | null>(null);
	const [budget, setBudget] = useState<Budget | null>(null);
	const [allocations, setAllocations] = useState<Allocation[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());

	const handleDateChangeOnClick = (monthIndex: number, newYear: number) => {
		setMonth(monthIndex);
		setYear(newYear);
	};

	// Sets user
	useEffect(() => {
		auth.onAuthStateChanged((user: User | null) => {
			setUser(user);
		});
	});

	// Sets budgets
	useEffect(() => {
		const fetchBudgetData = async () => {
			if (user) {
				const data = await getSelectedBudget(user.uid);
				setBudget(data);
			}
		};
		fetchBudgetData();
	}, [user]);

	// Fetches budget subcollections
	useEffect(() => {
		const fetchBudgetSubcollections = async () => {
			if (budget && user) {
				const allocationData = await getAllocations(user.uid, budget.id);
				const categoryData = await getCategories(user.uid, budget.id);
				const subcategoryData = await getSubcategories(user.uid, budget.id);
				const transactionData = await getTransactions(user.uid, budget.id);
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
					category.subcategories.sort((a, b) => a.position - b.position);
				}
				categoryData.sort((a, b) => a.position - b.position);
				setCategories(categoryData);
			}
		};
		fetchBudgetSubcollections();
	}, [user, budget]);

	console.log(transactions);

	calculateAllocations(categories, allocations, transactions, month, year);
	const categoryItems: JSX.Element[] = [];
	if (categories.length > 0) {
		for (const category of categories) {
			if (category.id === "00000000-0000-0000-0000-000000000000") {
				continue;
			}
			categoryItems.push(<CategoryItem name={category.name} currencyString={"$"} assigned={category.assigned} available={category.available} subcategories={category.subcategories} />);
		}
	}

	return (
		<>
			<header className={styles.header}>
				<Topbar month={month} year={year} handleDateChangeOnClick={handleDateChangeOnClick} />
				<Unassigned currency={budget ? budget.currency : "USD"} unassignedBalance={budget ? budget.unassignedBalance : 0} />
			</header>
			<main className={styles.main}>{categoryItems}</main>
		</>
	);
}
