import classNames from "classnames";
import styles from "./subcategory-item.module.scss";
import { useEffect, useState } from "react";

export type SubcategoryItemPropsType = {
	subcategoryID: string;
	name: string;
	currencyString: string;
	assigned: number;
	available: number;
	updateCategoryAllocations: (changeInAssignedValue: number) => void;
	updateSubcategoryAllocation: (subcategoryID: string, newBalance: number, changeInBalance: number) => void;
};

type AvailableAllocationClassesType = {
	[key: string]: boolean;
};

export function SubcategoryItem(props: SubcategoryItemPropsType) {
	const { subcategoryID, name, currencyString, assigned, available, updateCategoryAllocations, updateSubcategoryAllocation } = props;
	const [assignedAllocation, setAssignedAllocation] = useState<number>(assigned);
	const [availableAllocation, setAvailableAllocation] = useState<number>(available);
	const [key, setKey] = useState<number>(0);
	const [availableAllocationClasses, setAvailableAllocationClasses] = useState<AvailableAllocationClassesType>({ [styles.allocation]: true });

	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.currentTarget.blur();
		}
	};

	const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		let value = event.target.value;
		// Removes currency string if present
		if (value.includes(currencyString)) {
			value = value.replace(currencyString, "");
		}
		// Removes non-number characters
		const nonCurrencyRegex = /[^0-9.]/g;
		value = value.replace(nonCurrencyRegex, "");

		const isValidNumber = !isNaN(parseFloat(value));
		const newAssigned = isValidNumber ? parseFloat(value) * 1000000 : 0;
		const oldAssigned = assignedAllocation;
		const changeInAssignedValue = newAssigned - oldAssigned;

		if (changeInAssignedValue !== 0) {
			setAssignedAllocation(newAssigned);
			setAvailableAllocation(availableAllocation + changeInAssignedValue);
			updateCategoryAllocations(changeInAssignedValue);
			// Updating firebase
			updateSubcategoryAllocation(subcategoryID, newAssigned, changeInAssignedValue);
		}
		// Used to re-render this component
		setKey(key === 0 ? 1 : 0);
	};

	useEffect(() => {
		setAvailableAllocationClasses({
			[styles.allocation]: true,
			[styles.empty]: availableAllocation === 0,
			[styles.negative]: availableAllocation < 0,
		});
	}, [availableAllocation]);

	return (
		<section className={styles.subcategory}>
			<span className={styles.subcategoryName}>{name}</span>
			<input className={styles.input} type="text" defaultValue={currencyString + (assignedAllocation / 1000000).toFixed(2)} onBlur={handleInputBlur} onKeyDown={handleEnterKeyDown} key={key} />
			<div className={classNames(availableAllocationClasses)}>
				<span>
					{currencyString}
					{(availableAllocation / 1000000).toFixed(2)}
				</span>
			</div>
		</section>
	);
}
