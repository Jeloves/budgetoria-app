import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./category-item.module.scss";
import { SubcategoryItem } from "../subcategory-item";
import { useEffect, useState } from "react";
import { getAllocationBySubcategory, updateAssignedAllocation } from "@/firebase/allocations";
import { updateUnassignedBalance } from "@/firebase/budgets";
import { Category, Subcategory } from "@/firebase/models";
import { formatCurrency } from "@/utils/currency";
import { getTransactionsBySubcategory } from "@/firebase/transactions";

export type CategoryItemPropsType = {
	userID: string;
	budgetID: string;
	year: number;
	month: number;
	category: Category;
	filteredSubcategories: Subcategory[];
	refreshUnassignedBalance: () => void;
};

export type SubcategoryAllocation = {
    subcategory: Subcategory;
    assignedBalance: number;
    availableBalance: number;
};

export function CategoryItem(props: CategoryItemPropsType) {
	const { userID, budgetID, year, month, category, filteredSubcategories, refreshUnassignedBalance } = props;

	const [totalAssignedBalance, setTotalAssignedBalance] = useState<number>(0);
	const [totalAvailableBalance, setTotalAvailableBalance] = useState<number>(0);

	const [subcategoryAllocations, setSubcategoryAllocations] = useState<SubcategoryAllocation[]>([]);

	// Calculates balances and SubcategoryAllocations
	useEffect(() => {
		const fetch = async () => {
			const subcategoryAllocations: SubcategoryAllocation[] = [];
			let totalAssigned = 0;
			let totalAvailable = 0;

			for (const subcategory of filteredSubcategories) {
				// Calculates subcategory's balances
				const allocation = await getAllocationBySubcategory(userID, budgetID, subcategory.id, year, month);
				const transactions = await getTransactionsBySubcategory(userID, budgetID, subcategory.id, month, year);

				const assigned = allocation.balance;
				let available = assigned;
				for (const transaction of transactions) {
					transaction.outflow ? (available -= transaction.balance) : (available += transaction.balance);
				}

				// Creates subcategory allocation
				subcategoryAllocations.push({
					subcategory: subcategory,
					assignedBalance: assigned,
					availableBalance: available,
				});

				// Updates category balances
				totalAssigned += assigned;
				totalAvailable += available;
			}

			setTotalAssignedBalance(totalAssigned);
			setTotalAvailableBalance(totalAvailable);
			setSubcategoryAllocations(subcategoryAllocations);
		};
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userID, budgetID, month, year]);

	const handleShowSubcategoriesOnClick = () => {};

	const handleUpdateAssignedAllocation = async (changeInSubcategoryAssignedBalance: number, newSubcategoryAssignedBalance: number, subcategoryID: string) => {
		if (changeInSubcategoryAssignedBalance !== 0) {
			// Updates allocation doc in firebase
			updateAssignedAllocation(userID, budgetID, subcategoryID, month, year, newSubcategoryAssignedBalance);

			// Updates unassigned balance in firebase
			updateUnassignedBalance(userID, budgetID, changeInSubcategoryAssignedBalance * -1);
			refreshUnassignedBalance();

			// Updates total balances
			setTotalAssignedBalance((totalAssignedBalance) => totalAssignedBalance + changeInSubcategoryAssignedBalance);
			setTotalAvailableBalance((totalAvailableBalance) => totalAvailableBalance + changeInSubcategoryAssignedBalance);
		}
	};

	const subcategoryItems: JSX.Element[] = [];
	for (let i = 0; i < subcategoryAllocations.length; i++) {
		const subcategoryAllocation = subcategoryAllocations[i];

		subcategoryItems.push(<SubcategoryItem key={i} subcategoryAllocation={subcategoryAllocation} handleUpdateAssignedAllocation={handleUpdateAssignedAllocation} />);
	}

	return (
		<>
			<section className={styles.category}>
				<span className={styles.categoryName}>
					<IconButton button={{ onClick: handleShowSubcategoriesOnClick }} src={"/icons/arrow-down.svg"} altText={"Button to show subcategories"} />
					{category.name}
				</span>
				<div className={classNames(styles.allocation)}>
					<span>Assigned</span>
					{formatCurrency(totalAssignedBalance)}
				</div>
				<div className={classNames(styles.allocation)}>
					<span>Available</span>
					{formatCurrency(totalAvailableBalance)}
				</div>
			</section>
			<div>{subcategoryItems}</div>
		</>
	);
}
