/* eslint-disable @next/next/no-img-element */
import { cloneDeep } from "lodash";
import styles from "./payee-selection-subpage.module.scss";
import { sortStringsAlphabetically } from "@/utils/sorting";
import { useEffect, useState } from "react";
import { IconButton } from "@/features/ui";

export type PayeeSelectionSubpagePropsType = {
	selectedPayee: string;
	payees: string[];
	handleBackClick: () => void;
	createNewPayee: (newPayee: string) => void;
	selectPayee: (selectedPayee: string) => void;
};

export function PayeeSelectionSubpage(props: PayeeSelectionSubpagePropsType) {
	const { selectedPayee, handleBackClick, createNewPayee, selectPayee } = props;

	const [payees, setPayees] = useState<string[]>(props.payees);
	const [sortedPayees, setSortedPayees] = useState<string[]>([]);
	const [filter, setFilter] = useState<string>("");
	const [showCreatePayee, setShowCreatePayee] = useState<boolean>(false);

	// ALphabetically sorts and filters payees
	useEffect(() => {
		const sorted = cloneDeep(payees);
		sortStringsAlphabetically(sorted);

		if (filter) {
			const filtered = sorted.filter((payee) => payee.includes(filter));
			setSortedPayees(filtered);
		} else {
			setSortedPayees(sorted);
		}
	}, [payees, filter]);

	// Filtering payees
	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const currentFilter = event.currentTarget.value;
		if (currentFilter === "" || payees.includes(currentFilter)) {
			// If the filter is empty, or already exists as a payee...
			setShowCreatePayee(false);
		} else {
			setShowCreatePayee(true);
		}
		setFilter(event.currentTarget.value);
	};

	const payeeElements: JSX.Element[] = [];
	let sortingChar = "";
	for (let i = 0; i < sortedPayees.length; i++) {
		const payee = sortedPayees[i];
		if (sortingChar !== payee[0]) {
			sortingChar = payee[0];
			payeeElements.push(
				<div key={`sortingChar${i}`} className={styles.sortingChar}>
					{sortingChar}
				</div>
			);
		}

		const isSelectedPayee = payee === selectedPayee;
		payeeElements.push(
			<div
				key={`payee${i}`}
				className={styles.payee}
				onClick={() => {
					selectPayee(payee);
				}}
			>
				{payee}
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				{isSelectedPayee && <img src="/icons/checkmark.svg" alt="Payee selected icon" />}
			</div>
		);
	}

	return (
		<>
			<header data-test-id="payee-selection-subpage-header" className={styles.header}>
				<IconButton
					button={{
						onClick: handleBackClick,
					}}
					src={"/icons/arrow-left.svg"}
					altText={"Return to transaction page button"}
				/>
				<span>Select Payee</span>
			</header>
			<main className={styles.main}>
				<div className={styles.filter}>
					<img src="/icons/search-grey-300.svg" alt="Search icon" />
					<input type="text" placeholder="Enter payee..." onChange={handleFilterChange} />
				</div>
				<div className={styles.payeesContainer}>
					{showCreatePayee && (
						<div
							className={styles.createPayee}
							onClick={() => {
								createNewPayee(filter);
							}}
						>
							Create &quot;{filter}&quot;
							<img src="/icons/circled-plus-filled-grey-100.svg" alt="Create payee icon" />
						</div>
					)}
					{payeeElements}
				</div>
			</main>
		</>
	);
}
