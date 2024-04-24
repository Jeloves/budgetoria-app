import { IconButton } from "@/features/ui";
import styles from "./categories-subpage.module.scss";
import { Category, Subcategory } from "@/firebase/models";

export type CategoriesSubpagePropsType = {
	selectedSubcategoryID: string;
	categories: Category[];
	subcategories: Subcategory[];
	handleBackClick: () => void;
	selectSubcategory: (selectedSubcategoryID: string) => void;
};

export function CategoriesSubpage(props: CategoriesSubpagePropsType) {
	const { selectedSubcategoryID, categories, subcategories, handleBackClick, selectSubcategory } = props;

	const categoryElements: JSX.Element[] = [];
	for (let category of categories) {
		categoryElements.push(<div className={styles.category}>{category.name}</div>);
		const filteredSubcategories = subcategories.filter((subcategory) => subcategory.categoryID === category.id);
		const subcategoryElements: JSX.Element[] = [];

		for (let i = 0; i < filteredSubcategories.length; i++) {
			const subcategory = filteredSubcategories[i];
			const isSelected = subcategory.id === selectedSubcategoryID;
			let spanClass = "";
			if (subcategory.available < 0) {
				spanClass = styles.negative;
			} else if (subcategory.available > 0) {
				spanClass = styles.positive;
			}

			subcategoryElements.push(
				<div
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

			if (filteredSubcategories.length > 1 && i < filteredSubcategories.length - 1) {
				subcategoryElements.push(<hr className={styles.border} />);
			}
		}

		categoryElements.push(<div className={styles.subcategoryContainer}>{subcategoryElements}</div>);
	}

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
