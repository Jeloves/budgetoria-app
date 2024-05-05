import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./category-item.module.scss";
import { SubcategoryItem } from "../subcategory-item";
import { useEffect, useState } from "react";
import { CategoryAllocation, SubcategoryAllocation, assignAllocations } from "@/utils/allocate";
import { getAllocationBySubcategory, updateAssignedAllocation } from "@/firebase/allocations";
import { updateUnassignedBalance } from "@/firebase/budgets";
import { Allocation, Category, Subcategory, Transaction } from "@/firebase/models";
import { cloneDeep } from "lodash";
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
	}, [budgetID, filteredSubcategories, month, userID, year]);

	const handleShowSubcategoriesOnClick = () => {};

	const handleUpdateAssignedAllocation = (changeInSubcategoryAssignedBalance: number, newSubcategoryAssignedBalance: number, subcategoryID: string) => {
		if (changeInSubcategoryAssignedBalance !== 0) {
		    // Updates allocation doc in firebase
			updateAssignedAllocation(userID, budgetID, subcategoryID, month, year, newSubcategoryAssignedBalance);

            // Updates total balances
            setTotalAssignedBalance(totalAssignedBalance + changeInSubcategoryAssignedBalance);
            setTotalAvailableBalance(totalAvailableBalance + changeInSubcategoryAssignedBalance);

			// Updates unassigned balance in firebase
			updateUnassignedBalance(userID, budgetID, changeInSubcategoryAssignedBalance * -1);
		}
	};

	const subcategoryItems: JSX.Element[] = [];
	for (let i = 0; i < subcategoryAllocations.length; i++) {
		const subcategoryAllocation = subcategoryAllocations[i];

		subcategoryItems.push(<SubcategoryItem subcategoryAllocation={subcategoryAllocation} handleUpdateAssignedAllocation={handleUpdateAssignedAllocation} />);
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
