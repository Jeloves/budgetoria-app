import { IconButton } from "@/features/ui";
import styles from "./category-selection-subpage.module.scss";
import { Category, Subcategory } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";

export type CategorySelectionSubpagePropsType = {
	selectedSubcategoryID: string;
	categories: Category[];
	subcategories: Subcategory[];
	unassignedBalance: number;
	handleBackClick: () => void;
	selectSubcategory: (selectedSubcategoryID: string) => void;
};

export function CategorySelectionSubpage(props: CategorySelectionSubpagePropsType) {
	const { selectedSubcategoryID, categories, subcategories, unassignedBalance, handleBackClick, selectSubcategory } = props;

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
		const filteredSubcategories = subcategories.filter((subcategory) => subcategory.categoryID === category.id);
		const subcategoryElements: JSX.Element[] = [];
		for (let i = 0; i < filteredSubcategories.length; i++) {
			const subcategory = filteredSubcategories[i];

			// Checking for and styling selected subcategory
			const isSelected = subcategory.id === selectedSubcategoryID;
			let spanClass = "";
			if (subcategory.available < 0) {
				spanClass = styles.negative;
			} else if (subcategory.available > 0) {
				spanClass = styles.positive;
			}

			// Creating subcategory elements
			subcategoryElements.push(
				<div
					key={`subcategory${i}`}
					className={styles.subcategory}
					onClick={() => {
						selectSubcategory(subcategory.id);
					}}
				>
					<div className={styles.selected}>
						{/* eslint-disable @next/next/no-img-element */}
						<img className={isSelected ? styles.icon : ""} src="/icons/checkmark.svg" alt="Selected subcategory icon" />
					</div>
					{subcategory.name}
					<span className={spanClass}>${(subcategory.available / 1000000).toFixed(2)}</span>
				</div>
			);

			// Adding borders between subcategories
			if (filteredSubcategories.length > 1 && i < filteredSubcategories.length - 1) {
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
			<header className={styles.header}>
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
