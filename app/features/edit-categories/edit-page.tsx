/* eslint-disable react-hooks/exhaustive-deps */
import { EditCategoryItem } from "@/features/edit-categories";
import { Category, Subcategory } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";
import { IconButton } from "../ui";
import styles from "./edit-page.module.scss";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { handleCategoryChanges } from "@/utils/handleCategoryChanges";

export type EditPagePropsType = {
	userID: string;
	budgetID: string;
	categories: Category[];
	subcategories: Subcategory[];
	isShowingCategoryTemplate: boolean;
	handleCreateCategory: (category: Category) => void;
	handleDeleteCategory: (categoryID: string) => void;
	handleCreateSubcategory: (subcategory: Subcategory) => void;
	handleDeleteSubcategory: (subcategoryID: string) => void;
	handleCancelEditCategoriesClick: () => void;
};

export interface EditDataMap {
	deletedCategoriesByID: string[];
	newCategories: Category[];
	deletedSubcategoriesByID: string[];
	newSubcategories: Subcategory[];
	movedSubcategories: MovedSubcategoryMap[];
}
export interface MovedSubcategoryMap {
	oldCategoryID: string;
	newCategoryID: string;
	subcategoryID: string;
}

export function EditPage(props: EditPagePropsType) {
	const { subcategories, isShowingCategoryTemplate, handleCreateCategory, handleDeleteCategory, handleDeleteSubcategory, handleCreateSubcategory } = props;
	const [categories, setCategories] = useState<Category[]>(props.categories);
	const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
	const [renderKey, setRenderKey] = useState<number>(0);

	// Updates edit data whenever edits are made.
	const handleDeleteCategoryClick = (targetCategoryID: string) => {
		const updatedCategories = categories.filter((category) => category.id !== targetCategoryID);;
		setCategories(updatedCategories);
		setRenderKey(renderKey === 0 ? 1 : 0);
		handleDeleteCategory(targetCategoryID);
	};
	const handleCreateCategoryClick = (name: string) => {
		const newCategory = new Category(uuidv4(), name);
		const updatedCategories = [...categories, newCategory];
		updatedCategories.sort((a, b) => {
			if (a.name.toLowerCase() < b.name.toLowerCase()) {
				return -1;
			} else if (a.name.toLowerCase() > b.name.toLowerCase()) {
				return 1;
			} else {
				return 0;
			}
		});
		setCategories(updatedCategories);
		setRenderKey(renderKey === 0 ? 1 : 0);
		handleCreateCategory(newCategory);
	};
	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const inputValue = event.currentTarget.value;
			if (inputValue) {
				handleCreateCategoryClick(inputValue);
			} else {
				alert("A category name must be inputted");
			}
		}
	};

	const handleSelectSubcategoryClick = (subcategory: Subcategory) => {
		setSelectedSubcategory(subcategory);
		setRenderKey(renderKey === 0 ? 1 : 0);
	};

	const handleSelectCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {};

	const categorySelectionHeader = (
		<header className={classNames(styles.header, styles.selectionHeader)}>
			<button
				className={classNames(styles.textButton, styles.cancel)}
				onClick={() => {
					setSelectedSubcategory(null);
				}}
			>
				Cancel
			</button>
			Moving Subcategory: {selectedSubcategory ? selectedSubcategory.name : ""}
			<button className={classNames(styles.textButton, styles.empty)}>Cancel</button>
		</header>
	);

	let editContent: JSX.Element[] = [];
	let categorySelectionContent: JSX.Element[] = [
		<h1 key={-1} className={classNames(styles.categoryOption, styles.categoryOptionHeading)}>
			Select New Category
		</h1>,
	];

	for (let i = 0; i < categories.length; i++) {
		const category = categories[i];
		const filteredSubcategories = subcategories.filter((subcategory) => {
			return subcategory.categoryID === category.id;
		});
		const itemToRender = (
			<EditCategoryItem
				key={i}
				category={category}
				subcategories={filteredSubcategories}
				handleCreateSubcategory={handleCreateSubcategory}
				handleDeleteSubcategory={handleDeleteSubcategory}
				handleDeleteCategoryClick={handleDeleteCategoryClick}
				handleSelectSubcategoryClick={handleSelectSubcategoryClick}
			/>
		);

		editContent.push(itemToRender);
		categorySelectionContent.push(
			<button key={i} id={category.id} onClick={handleSelectCategoryClick} className={styles.categoryOption}>
				{category.name}
			</button>
		);
	}

	return (
		<>
			{isShowingCategoryTemplate ? (
				<div className={styles.emptyCategory}>
					<input type="text" onKeyDown={handleEnterKeyDown} />
					<IconButton
						button={{
							onClick: () => {},
						}}
						src={"/icons/circled-minus.svg"}
						altText={"Button to cancel new category"}
					/>
				</div>
			) : null}
			<div key={renderKey}>{selectedSubcategory ? categorySelectionContent : editContent}</div>
		</>
	);
}
