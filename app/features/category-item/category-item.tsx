import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./category-item.module.scss";
import { Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { SubcategoryItem } from "../subcategory-item";
import { useState } from "react";
import { calculateCategoryItemData } from "@/utils/calculateCategoryItemData";
import { CategoryAllocation } from "@/utils/allocate";

export type CategoryItemPropsType = {
	categoryAllocation: CategoryAllocation;
	updateSubcategoryAllocation: (subcategoryID: string, newBalance: number, changeInBalance: number) => void;
};

export function CategoryItem(props: CategoryItemPropsType) {
	const { categoryAllocation, updateSubcategoryAllocation } = props;
	const [totalAssignedBalance, setTotalAssignedBalance] = useState<number>(categoryAllocation.totalAssignedBalance);
	const [totalAvailableBalance, setTotalAvailableBalance] = useState<number>(categoryAllocation.totalAvailableBalance);

	const category = categoryAllocation.category;


	const handleShowSubcategoriesOnClick = () => {};

	const updateCategoryAllocations = (changeInAssignedValue: number) => {
		if (changeInAssignedValue !== 0) {
			const newAssigned = totalAssignedBalance + changeInAssignedValue;
			const newAvailable = totalAvailableBalance + changeInAssignedValue;
			setTotalAssignedBalance(newAssigned);
			setTotalAvailableBalance(newAvailable);
		}
	};

	const subcategoryItems: JSX.Element[] = [];
	for (let i = 0; i < categoryAllocation.subcategoryAllocations.length; i++) {
		const subcategoryAllocation = categoryAllocation.subcategoryAllocations[i];

		subcategoryItems.push(
			<SubcategoryItem
				key={i}
				subcategoryAllocation={subcategoryAllocation}
				updateCategoryAllocations={updateCategoryAllocations}
				updateSubcategoryAllocation={updateSubcategoryAllocation}
				currencyString="$"/>
		);
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
					$
					{(totalAssignedBalance / 1000000).toFixed(2)}
				</div>
				<div className={classNames(styles.allocation)}>
					<span>Available</span>
					$
					{(totalAvailableBalance / 1000000).toFixed(2)}
				</div>
			</section>
			<div>{subcategoryItems}</div>
		</>
	);
}
