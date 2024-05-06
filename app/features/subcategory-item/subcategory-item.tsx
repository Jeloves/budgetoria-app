import classNames from "classnames";
import styles from "./subcategory-item.module.scss";
import { useEffect, useRef, useState } from "react";
import { SubcategoryAllocation } from "../category-item/category-item";
import { formatCurrency } from "@/utils/currency";

export type SubcategoryItemPropsType = {
    subcategoryAllocation: SubcategoryAllocation;
	handleUpdateAssignedAllocation: (changeInSubcategoryAssignedValue: number, newSubcategoryAssignedBalance: number, subcategoryID: string) => void;
};

type AvailableAllocationClassesType = {
	[key: string]: boolean;
};

export function SubcategoryItem(props: SubcategoryItemPropsType) {
	const { subcategoryAllocation, handleUpdateAssignedAllocation } = props;
	const [assignedBalance, setAssignedBalance] = useState<number>(subcategoryAllocation.assignedBalance);
	const [availableBalance, setAvailableBalance] = useState<number>(subcategoryAllocation.availableBalance);
	const [availableAllocationClasses, setAvailableAllocationClasses] = useState<AvailableAllocationClassesType>({ [styles.allocation]: true });


	// Styles available allocation
	useEffect(() => {
		setAvailableAllocationClasses({
			[styles.allocation]: true,
			[styles.empty]: availableBalance === 0,
			[styles.negative]: availableBalance < 0,
		});
	}, [availableBalance]);

	const assignedBalanceInputReference = useRef<HTMLInputElement>(null);

	const handleOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		const inputElement = assignedBalanceInputReference.current;

		// Places cursor at the right-most position of the input
		if (inputElement) {
			setTimeout(() => {
				inputElement.setSelectionRange(0, inputElement.value.length);
			}, 0);
		}

		// Removes '$' character
		const inputText = event.currentTarget.value;
		event.currentTarget.value = inputText.replace("$", "");
	};
	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.currentTarget.blur();
		}
	};
	const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		let inputText = event.target.value;

		// Removes non-number characters
		const nonCurrencyRegex = /[^0-9.-]/g;
		inputText = inputText.replace(nonCurrencyRegex, "");

		// Removes any negative signs after the zeroth-index
		const inputCharacters = inputText.split("");
		for (let i = 0; i < inputCharacters.length; i++) {
			const character = inputCharacters[i];
			if (character === "-" && i !== 0) {
				inputCharacters[i] = "";
			}
		}
		inputText = inputCharacters.join("");

		// Creates a new assigned value
		const isValidNumber = !isNaN(parseFloat(inputText));
		const newAssignedBalance = isValidNumber ? parseFloat(inputText) * 1000000 : 0;

		// Sets availableBalance useState and input text
		const changeInAssignedBalance = newAssignedBalance - assignedBalance;
		setAvailableBalance(availableBalance + changeInAssignedBalance);

		// Sets assignedBalance useState and input text
		setAssignedBalance(newAssignedBalance);
		event.currentTarget.value = formatCurrency(newAssignedBalance);

		// Update category balances and firebase allocation doc
		handleUpdateAssignedAllocation(changeInAssignedBalance, newAssignedBalance, subcategoryAllocation.subcategory.id);
	};

	return (
		<section className={styles.subcategory}>
			<span className={styles.subcategoryName}>{subcategoryAllocation.subcategory.name}</span>
			<input className={styles.input} ref={assignedBalanceInputReference} type="text" defaultValue={formatCurrency(assignedBalance)} onFocus={handleOnFocus} onBlur={handleOnBlur} onKeyDown={handleEnterKeyDown}/>
			<div className={classNames(availableAllocationClasses)}>
				<span>{formatCurrency(availableBalance)}</span>
			</div>
		</section>
	);
}
