import { IconButton } from "@/features/ui";
import styles from "./category-selection-subpage.module.scss";
import { Category, Subcategory } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";
import { useEffect, useState } from "react";
import { getAllocationBySubcategory } from "@/firebase/allocations";
import { getTransactionsBySubcategory } from "@/firebase/transactions";
import { BudgetData } from "pages/budget";
import { formatCurrency } from "@/utils/currency";

export type CategorySelectionSubpagePropsType = {
	budgetData: BudgetData;
	selectedSubcategoryID: string;
	categories: Category[];
	subcategories: Subcategory[];
	unassignedBalance: number;
	handleBackClick: () => void;
	selectSubcategory: (selectedSubcategoryID: string) => void;
};

type SubcategoryAllocation = {
	subcategory: Subcategory;
	availableBalance: number;
}

export function CategorySelectionSubpage(props: CategorySelectionSubpagePropsType) {
	const { budgetData, selectedSubcategoryID, categories, subcategories, unassignedBalance, handleBackClick, selectSubcategory } = props;

	const [subcategoryAllocations, setSubcategoryAllocations] = useState<SubcategoryAllocation[]>([])

	// Calculates subcategory available balances
	useEffect(() => {
		const fetch = async () => {
			const subcategoryAllocations: SubcategoryAllocation[] = [];

			for (const subcategory of subcategories) {
				// Calculates subcategory's balances
				const allocation = await getAllocationBySubcategory(budgetData.userID, budgetData.budgetID, subcategory.id, budgetData.year, budgetData.month);
				const transactions = await getTransactionsBySubcategory(budgetData.userID, budgetData.budgetID, subcategory.id, budgetData.month, budgetData.year);

				let available = allocation.balance;
				for (const transaction of transactions) {
					transaction.outflow ? (available -= transaction.balance) : (available += transaction.balance);
				}

				// Creates subcategory allocation
				subcategoryAllocations.push({
					subcategory: subcategory,
					availableBalance: available,
				});
			}

			setSubcategoryAllocations(subcategoryAllocations);
		};
		fetch();
	}, [budgetData, subcategories]);

	const categoryElements: JSX.Element[] = [];
	for (let i = 0; i < categories.length; i++) {
		// Element for category label
		const category = categories[i];
		categoryElements.push(
			<div key={`category${i}`} className={styles.category}>
				{category.name}
			</div>
		);

		// Elements for subcategory labels
		const filteredSubcategoryAllocations = subcategoryAllocations.filter((subcategoryAllocation) => subcategoryAllocation.subcategory.categoryID === category.id);
		const subcategoryElements: JSX.Element[] = [];
		for (let i = 0; i < filteredSubcategoryAllocations.length; i++) {
			const subcategoryAllocation = filteredSubcategoryAllocations[i];

			// Checking for and styling selected subcategory
			const isSelected = subcategoryAllocation.subcategory.id === selectedSubcategoryID;
			let spanClass = "";
			if (subcategoryAllocation.availableBalance < 0) {
				spanClass = styles.negative;
			} else if (subcategoryAllocation.availableBalance > 0) {
				spanClass = styles.positive;
			}

			// Creating subcategory elements
			subcategoryElements.push(
				<div
					key={`subcategory${i}`}
					className={styles.subcategory}
					onClick={() => {
						selectSubcategory(subcategoryAllocation.subcategory.id);
					}}
				>
					<div className={styles.selected}>
						{/* eslint-disable @next/next/no-img-element */}
						<img className={isSelected ? styles.icon : ""} src="/icons/checkmark.svg" alt="Selected subcategory icon" />
					</div>
					{subcategoryAllocation.subcategory.name}
					<span className={spanClass}>{formatCurrency(subcategoryAllocation.availableBalance)}</span>
				</div>
			);

			// Adding borders between subcategories
			if (filteredSubcategoryAllocations.length > 1 && i < filteredSubcategoryAllocations.length - 1) {
				subcategoryElements.push(<hr key={`border${i}`} className={styles.border} />);
			}
		}

		// Grouping subcategory items into a container
		categoryElements.push(
			<div key={`subcategoryContainer${i}`} className={styles.subcategoryContainer}>
				{subcategoryElements}
			</div>
		);
	}
	// Creating UnassignedCategory element
	const isUnassignedSelected = selectedSubcategoryID === NIL_UUID;
	let unassignedSpanClasses = "";
	if (unassignedBalance < 0) {
		unassignedSpanClasses = styles.negative;
	} else if (unassignedBalance > 0) {
		unassignedSpanClasses = styles.positive;
	}
	// Pushing unassigned elements to the start of categoryElements array
	categoryElements.unshift(
		<div key={"unassignedSubcategoryContainer"} className={styles.subcategoryContainer}>
			<div
				key={"unassignedSubcategory"}
				className={styles.subcategory}
				onClick={() => {
					selectSubcategory(NIL_UUID);
				}}
			>
				<div className={styles.selected}>
					{/* eslint-disable @next/next/no-img-element */}
					<img className={isUnassignedSelected ? styles.icon : ""} src="/icons/checkmark.svg" alt="Selected subcategory icon" />
				</div>
				Ready to Assign
				<span className={unassignedSpanClasses}>${(unassignedBalance / 1000000).toFixed(2)}</span>
			</div>
		</div>
	);
	categoryElements.unshift(
		<div key={"unassignedCategory"} className={styles.category}>
			Unassigned
		</div>
	);

	return (
		<>
			<header data-test-id="category-selection-subpage-header" className={styles.header}>
				<IconButton
					button={{
						onClick: handleBackClick,
					}}
					src={"/icons/arrow-left.svg"}
					altText={"Return to transaction page button"}
				/>
				<span>Select Category</span>
			</header>
			<main className={styles.main}>{categoryElements}</main>
		</>
	);
}
