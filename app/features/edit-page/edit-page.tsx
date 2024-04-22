/* eslint-disable react-hooks/exhaustive-deps */
import { EditCategoryItem } from "@/features/edit-page";
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
	handleUpdateCategoryName: (category: Category, newName: string) => void;
	handleCreateSubcategory: (subcategory: Subcategory) => void;
	handleDeleteSubcategory: (subcategoryID: string) => void;
	handleCancelEditCategoriesClick: () => void;
	navigateToMoveSubcategorySubpage: (subcategory: Subcategory, categories: Category[]) => void;
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

export interface UpdatedCategoryNames {
	id: string;
	oldName: string;
	newName: string;
}

export function EditPage(props: EditPagePropsType) {
	const {
		categories,
		subcategories,
		isShowingCategoryTemplate,
		handleCreateCategory,
		handleDeleteCategory,
		handleUpdateCategoryName,
		handleDeleteSubcategory,
		handleCreateSubcategory,
		navigateToMoveSubcategorySubpage,
	} = props;
	const [renderKey, setRenderKey] = useState<number>(0);
	const [sortedCategories, setSortedCategories] = useState<Category[]>([]);
	const [sortedSubcategories, setSortedSubcategories] = useState<Subcategory[]>([]);

	// Sorting categories and subcategories alphabetically
	useEffect(() => {
		const sorted = [...categories].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
		setSortedCategories(sorted);
		setRenderKey(renderKey === 0 ? 1 :0)
	}, [categories]);
	useEffect(() => {
		const sorted = [...subcategories].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
		setSortedSubcategories(sorted);
		setRenderKey(renderKey === 0 ? 1 :0)
	}, [subcategories]);

	// Updates edit data whenever edits are made.
	const handleDeleteCategoryClick = (targetCategoryID: string) => {
		handleDeleteCategory(targetCategoryID);
		setRenderKey(renderKey === 0 ? 1 :0)
	};
	const handleCreateCategoryClick = (name: string) => {
		const newCategory = new Category(uuidv4(), name);
		handleCreateCategory(newCategory);
	};
	const handleCreateCategoryEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
		navigateToMoveSubcategorySubpage(subcategory, categories);
	};

	let editContent: JSX.Element[] = [];
	for (let i = 0; i < sortedCategories.length; i++) {
		const category = sortedCategories[i];
		const filteredSubcategories = sortedSubcategories.filter((subcategory) => {
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
				handleUpdateCategoryName={handleUpdateCategoryName}
			/>
		);

		editContent.push(itemToRender);
	}

	return (
		<>
			{isShowingCategoryTemplate ? (
				<div className={styles.emptyCategory}>
					<input type="text" onKeyDown={handleCreateCategoryEnterKeyDown} />
					<IconButton
						button={{
							onClick: () => {},
						}}
						src={"/icons/circled-minus.svg"}
						altText={"Button to cancel new category"}
					/>
				</div>
			) : null}
			<div key={renderKey}>{editContent}</div>
		</>
	);
}
