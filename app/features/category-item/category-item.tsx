import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./category-item.module.scss";
import { Subcategory } from "@/firebase/models";
import { SubcategoryItem } from "../subcategory-item";
import { useState } from "react";

export type CategoryItemPropsType = {
	name: string;
	currencyString: string;
	assigned: number;
	available: number;
	subcategories: Subcategory[];
	updateSubcategoryAllocation: (subcategoryID: string, newBalance: number, changeInBalance: number) => void;
};

export function CategoryItem(props: CategoryItemPropsType) {
	const { name, currencyString, assigned, available, subcategories, updateSubcategoryAllocation } = props;
	const [assignedAllocation, setAssignedAllocation] = useState<number>(assigned);
	const [availableAllocation, setAvailableAllocation] = useState<number>(available);

	const handleShowSubcategoriesOnClick = () => {};

	const updateCategoryAllocations = (changeInAssignedValue: number) => {
		if (changeInAssignedValue !== 0) {
			const newAssigned = assignedAllocation + changeInAssignedValue;
			const newAvailable = availableAllocation + changeInAssignedValue;
			setAssignedAllocation(newAssigned);
			setAvailableAllocation(newAvailable);
		}
	};

	const subcategoryItems: JSX.Element[] = [];
	for (const subcategory of subcategories) {
		subcategoryItems.push(
			<SubcategoryItem
				subcategoryID={subcategory.id}
				name={subcategory.name}
				currencyString={currencyString}
				assigned={subcategory.assigned}
				available={subcategory.available}
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
					{name}
				</span>
				<div className={classNames(styles.allocation)}>
					<span>Assigned</span>
					{currencyString}
					{(assignedAllocation / 1000000).toFixed(2)}
				</div>
				<div className={classNames(styles.allocation)}>
					<span>Available</span>
					{currencyString}
					{(availableAllocation / 1000000).toFixed(2)}
				</div>
			</section>
			<div>{subcategoryItems}</div>
		</>
	);
}
