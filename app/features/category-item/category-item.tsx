import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./category-item.module.scss";
import { Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { SubcategoryItem } from "../subcategory-item";
import { useState } from "react";
import { calculateCategoryItemData } from "@/utils/calculateCategoryItemData";

export type CategoryItemPropsType = {
	currencyString: string;
	category: Category;
	subcategories: Subcategory[];
	allocations: Allocation[];
	transactions: Transaction[];
	updateSubcategoryAllocation: (subcategoryID: string, newBalance: number, changeInBalance: number) => void;
};

export function CategoryItem(props: CategoryItemPropsType) {
	const { currencyString, category, subcategories, allocations, transactions, updateSubcategoryAllocation } = props;
	const data = calculateCategoryItemData(subcategories, allocations, transactions);
	const [totalAssignedBalance, setTotalAssignedBalance] = useState<number>(data.categoryAssignedBalance);
	const [totalAvailableBalance, setTotalAvailableBalance] = useState<number>(data.categoryAvailableBalance);

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
	for (let i = 0; i < subcategories.length; i++) {
		const subcategory = subcategories[i];
		const subcategoryAllocations = data.subcategoryAllocations.find((allocationObject) => {
			return allocationObject.subcategoryID === subcategory.id;
		});

		subcategoryItems.push(
			<SubcategoryItem
				key={i}
				subcategoryID={subcategory.id}
				name={subcategory.name}
				currencyString={currencyString}
				assigned={subcategoryAllocations!.subcategoryAssignedBalance}
				available={subcategoryAllocations!.subcategoryAvailableBalance}
				updateCategoryAllocations={updateCategoryAllocations}
				updateSubcategoryAllocation={updateSubcategoryAllocation}
			/>
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
					{currencyString}
					{(totalAssignedBalance / 1000000).toFixed(2)}
				</div>
				<div className={classNames(styles.allocation)}>
					<span>Available</span>
					{currencyString}
					{(totalAvailableBalance / 1000000).toFixed(2)}
				</div>
			</section>
			<div>{subcategoryItems}</div>
		</>
	);
}
