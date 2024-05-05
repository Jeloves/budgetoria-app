import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./category-item.module.scss";
import { SubcategoryItem } from "../subcategory-item";
import { useState } from "react";
import { CategoryAllocation, assignAllocations } from "@/utils/allocate";
import { updateAssignedAllocation } from "@/firebase/allocations";
import { updateUnassignedBalance } from "@/firebase/budgets";
import { Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { cloneDeep } from "lodash";
import { formatCurrency } from "@/utils/currency";

export type CategoryItemPropsType = {
	userID: string;
	budgetID: string;
	year: number;
	month: number;
	category: Category;
	filteredSubcategories: Subcategory[];
	filteredAllocations: Allocation[];
	filteredTransactions: Transaction[];
	refreshUnassignedBalance: () => void;
};

export function CategoryItem(props: CategoryItemPropsType) {
	const { userID, budgetID, year, month, category, filteredAllocations, filteredSubcategories, filteredTransactions, refreshUnassignedBalance } = props;
	const [categoryAllocation, setCategoryAllocation] = useState<CategoryAllocation>(assignAllocations(userID, budgetID, category, filteredSubcategories, filteredAllocations, filteredTransactions, year, month));

	const handleShowSubcategoriesOnClick = () => {};

	const handleUpdateAssignedAllocation = (changeInSubcategoryAssignedBalance: number, newSubcategoryAssignedBalance: number, subcategoryID: string) => {
		if (changeInSubcategoryAssignedBalance !== 0) {
			// Updates category allocation
			const updatedCategoryAllocation = cloneDeep(categoryAllocation);
			const updatedTotalAssigned = updatedCategoryAllocation.totalAssignedBalance + changeInSubcategoryAssignedBalance;
			const updatedTotalAvailable = updatedCategoryAllocation.totalAvailableBalance + changeInSubcategoryAssignedBalance;
			updatedCategoryAllocation.totalAssignedBalance = updatedTotalAssigned;
			updatedCategoryAllocation.totalAvailableBalance = updatedTotalAvailable;
			setCategoryAllocation(updatedCategoryAllocation);

			// Updates allocation doc in firebase
			updateAssignedAllocation(userID, budgetID, subcategoryID, month, year, newSubcategoryAssignedBalance);

			// Updates unassigned balance in firebase
			updateUnassignedBalance(userID, budgetID, changeInSubcategoryAssignedBalance);
			refreshUnassignedBalance();
		}
	};

	const subcategoryItems: JSX.Element[] = [];
	for (let i = 0; i < categoryAllocation.subcategoryAllocations.length; i++) {
		const subcategoryAllocation = categoryAllocation.subcategoryAllocations[i];

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
                    {formatCurrency(categoryAllocation.totalAssignedBalance)}
				</div>
				<div className={classNames(styles.allocation)}>
					<span>Available</span>{formatCurrency(categoryAllocation.totalAvailableBalance)}
				</div>
			</section>
			<div>{subcategoryItems}</div>
		</>
	);
}
