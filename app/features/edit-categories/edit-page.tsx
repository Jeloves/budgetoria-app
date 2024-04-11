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
	const { categoryData, subcategories, isShowingCategoryTemplate, handleCreateCategory, handleDeleteSubcategory, handleCreateSubcategory } = props;
	const [categories, setCategories] = useState<Category[]>(props.categories);
	const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
	const [renderKey, setRenderKey] = useState<number>(0);

	// Alphabetically ordering categories
	useEffect(() => {
		console.log("use effect called");
		const sortedCategories = [...categories];
		sortedCategories.sort((a: Category, b: Category) => {
			if (a.name.toLowerCase() < b.name.toLowerCase()) {
				return -1;
			} else if (a.name.toLowerCase() > b.name.toLowerCase()) {
				return 1;
			} else {
				return 0;
			}
		});
	}, [categories])

	// Updates edit data whenever edits are made.
	const handleDeleteCategoryClick = (targetCategoryID: string) => {
		if (!deletedCategoriesByID.includes(targetCategoryID)) {
			// Removing the category
			deletedCategoriesByID.push(targetCategoryID);
			const newCategories = categories.filter((category) => category.id !== targetCategoryID);
			setCategories(newCategories);

			// Removing subcategories
			const filteredSubcategories = subcategories.filter((subcategory) => {
				return subcategory.categoryID === targetCategoryID;
			});
			for (const subcategory of filteredSubcategories) {
				if (!deletedSubcategoriesByID.includes(subcategory.id)) {
					deletedSubcategoriesByID.push(subcategory.id);
				}
			}
			const newSubcategories = subcategories.filter((subcategory) => subcategory.categoryID !== targetCategoryID);
			setSubcategories(newSubcategories);
		}
	};
	const handleCreateCategoryClick = (name: string) => {
		const newCategory = new Category(uuidv4(), name);
		const updatedCategories: Category[] = [...categories, newCategory];
		setCategories(updatedCategories);
		handleCreateCategory(newCategory);
	}
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

	console.log("rendered categories", categories);

	const handleSelectSubcategoryClick = (subcategory: Subcategory) => {
		console.log("Selected:", subcategory);
		setSelectedSubcategory(subcategory);
		setRenderKey(renderKey === 0 ? 1 : 0);
	};

	const handleSelectCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const oldCategoryID = selectedSubcategory!.categoryID;
		const newCategoryID = event.currentTarget.id;
		if (oldCategoryID !== newCategoryID) {
			movedSubcategories.push({ oldCategoryID: oldCategoryID, newCategoryID: newCategoryID, subcategoryID: selectedSubcategory!.id });

			const targetSubcategoryIndex = subcategories.findIndex((subcategory) => subcategory.id === selectedSubcategory!.id);
			subcategories[targetSubcategoryIndex].categoryID = newCategoryID;

			setSelectedSubcategory(null);
			setRenderKey(renderKey === 0 ? 1 : 0);
		}
	};

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
		)
		console.log(`Item ${i}`, itemToRender)
		editContent.push(
			itemToRender
		);
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
			{selectedSubcategory ? categorySelectionContent : editContent}
		</>
	);
}
