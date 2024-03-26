import { EditCategoryItem } from "@/features/edit-categories";
import { Category, Subcategory } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";
import { IconButton } from "../ui";
import styles from "./edit-page.module.scss";
import { useEffect, useState } from "react";
import classNames from "classnames";

export type EditPagePropsType = {
	categoryData: Category[];
};

export function EditPage(props: EditPagePropsType) {
	const [categories, setCategories] = useState<Category[]>(props.categoryData);
	const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory[]>([]);
	const [mainKey, setMainKey] = useState<number>(0);

	const deletedSubcategoriesByID: string[] = [];
	const newSubcategories: Subcategory[] = [];

	const handleDeleteSubcategoryClick = (subcategoryID: string, categoryID: string) => {
		if (!deletedSubcategoriesByID.includes(subcategoryID)) {
			deletedSubcategoriesByID.push(subcategoryID);

			const targetCategoryIndex = categories.findIndex((category) => category.id === categoryID);
			const targetSubcategoryIndex = categories[targetCategoryIndex].subcategories.findIndex((subcategory) => subcategory.id === subcategoryID);
			categories[targetCategoryIndex].subcategories.splice(targetSubcategoryIndex, 1);
			setMainKey(mainKey === 0 ? 1 : 0);
		}
	};

	const handleAddSubcategoryClick = (subcategory: Subcategory) => {
		if (!newSubcategories.includes(subcategory)) {
			newSubcategories.push(subcategory);

			const targetIndex = categories.findIndex((category) => category.id === subcategory.categoryID);
			categories[targetIndex].subcategories.push(subcategory);
			categories[targetIndex].subcategories.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
			setMainKey(mainKey === 0 ? 1 : 0);
		}
	};

	const handleSelectSubcategoryClick = (subcategory: Subcategory) => {};

	const handleSelectCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const selectedCategoryID = event.currentTarget.id;
	};

	const editHeader = (
		<>
			<div>
				<button className={classNames(styles.textButton, styles.cancel)}>Cancel</button>
			</div>
			Edit Categories
			<div>
				<IconButton button={{ onClick: () => {} }} src="/icons/add-folder.svg" altText="Button to add new category" />
				<button className={classNames(styles.textButton, styles.finish)}>Done</button>
			</div>
		</>
	);

	const categorySelectionHeader = (
		<>
			<button className={classNames(styles.textButton, styles.cancel)}>Cancel</button>
			<span>Subcategory</span>
			<button className={classNames(styles.textButton, styles.empty)}>Done</button>
		</>
	);

	let editContent: JSX.Element[] = [];
	let categorySelectionContent: JSX.Element[] = [];

	editContent.length = 0;
	categorySelectionContent.length = 0;
	for (let i = 0; i < categories.length; i++) {
		const category = categories[i];
		if (category.id === NIL_UUID) {
			continue;
		}
		editContent.push(<EditCategoryItem key={i} category={category} handleDeleteSubcategoryClick={handleDeleteSubcategoryClick} handleAddSubcategoryClick={handleAddSubcategoryClick} />);
		categorySelectionContent.push(
			<button key={i} id={category.id} onClick={handleSelectCategoryClick} className={styles.categoryOption}>
				{category.name}
			</button>
		);
	}
	return (
		<>
			<header className={styles.header}>{selectedSubcategory.length > 0 ? categorySelectionHeader : editHeader}</header>
			<main key={mainKey} className={classNames(styles.content, styles.categorySelectionContent)}>
				{selectedSubcategory.length > 0 ? categorySelectionContent : editContent}
			</main>
		</>
	);
}
