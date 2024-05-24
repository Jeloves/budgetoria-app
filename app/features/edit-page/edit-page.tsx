/* eslint-disable react-hooks/exhaustive-deps */
import { EditCategoryItem } from "@/features/edit-page";
import { Category, Subcategory } from "@/firebase/models";
import { IconButton } from "../ui";
import styles from "./edit-page.module.scss";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { EditPageHeader } from "./edit-page-header/edit-page-header";
import { createCategory, createSubcategory, deleteCategory, deleteSubcategory, updateCategory, updateSubcategory } from "@/firebase/categories";
import { cloneDeep } from "lodash";
import { deleteAllocationsBySubcategory } from "@/firebase/allocations";
import { MoveSubcategoryHeader } from "./move-subcategory-subpage/move-subcategory-header";
import { MoveSubcategorySubpage } from "./move-subcategory-subpage/move-subcategory-subpage";
import { BudgetData } from "pages/budget";

export type EditPagePropsType = {
	budgetData: BudgetData;
	categories: Category[];
	subcategories: Subcategory[];
	handleFinishEdits: () => void;
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
	const { budgetData, handleFinishEdits } = props;
	const [renderKey, setRenderKey] = useState<number>(0);
	const [isShowingCategoryTemplate, setIsShowingCategoryTemplate] = useState<boolean>(false);
	const [categories, setCategories] = useState<Category[]>(props.categories);
	const [subcategories, setSubcategories] = useState<Subcategory[]>(props.subcategories);
	const [subcategoryToMove, setSubcategoryToMove] = useState<Subcategory | null>(null);
	const [subpageClasses, setSubpageClasses] = useState<string[]>([styles.subpage]);

	// Re-renders categories and subcategories when edits are made.
	useEffect(() => {
		setRenderKey(renderKey === 0 ? 1 : 0);
	}, [categories, subcategories]);

	// Category Edits
	const handleShowCategoryTemplate = () => {
		setIsShowingCategoryTemplate(!isShowingCategoryTemplate);
	};
	const handleCreateCategory = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const name = event.currentTarget.value;
			if (name) {
				const newCategory = new Category(uuidv4(), name);
				// Updates and sorts categories useState
				const updatedCategories = cloneDeep(categories);
				updatedCategories.push(newCategory);
				updatedCategories.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
				setCategories(updatedCategories);
				// Creates new category doc in firebase
				createCategory(budgetData.userID, budgetData.budgetID, newCategory);
				// Hides category template
				handleShowCategoryTemplate();
			} else {
				alert("A name must be inputted");
			}
		}
	};
	const handleDeleteCategory = (targetCategoryID: string) => {
		// Deleting the target category
		const updatedCategories = [...categories].filter((category) => category.id !== targetCategoryID);
		setCategories(updatedCategories);
		// Deleting category doc from firebase
		deleteCategory(budgetData.userID, budgetData.budgetID, targetCategoryID);

		// Deleting subcategories
		const deletedSubcategories: Subcategory[] = [];
		const updatedSubcategories: Subcategory[] = [];
		for (let subcategory of subcategories) {
			if (subcategory.categoryID === targetCategoryID) {
				deletedSubcategories.push(subcategory);
			} else {
				updatedSubcategories.push(subcategory);
			}
		}
		setSubcategories(updatedSubcategories);

		for (let subcategory of deletedSubcategories) {
			// Deleting subcategory docs from firebase
			deleteSubcategory(budgetData.userID, budgetData.budgetID, subcategory.id);
			// Deleting allocation docs with target subcategoryID
			deleteAllocationsBySubcategory(budgetData.userID, budgetData.budgetID, subcategory.id);
		}
	};
	const handleUpdateCategoryName = (targetCategory: Category, newName: string) => {
		// Updating the target category
		const updatedCategories = cloneDeep(categories);
		const targetIndex = updatedCategories.findIndex((category) => category.id === targetCategory.id);
		if (updatedCategories[targetIndex].name !== newName) {
			updatedCategories[targetIndex].name = newName;
			// Updating category doc in firebase
			updateCategory(budgetData.userID, budgetData.budgetID, updatedCategories[targetIndex]);
			// Sorting and re-rendering categories
			updatedCategories.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
			setCategories(updatedCategories);
		}
	};

	// Subcategory Edits
	const handleCreateSubcategory = (name: string, categoryID: string) => {
		const newSubcategory = new Subcategory(uuidv4(), name, categoryID);
		// Updates and sorts subcategories useState
		const updatedSubcategories = cloneDeep(subcategories);
		updatedSubcategories.push(newSubcategory);
		updatedSubcategories.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
		setSubcategories(updatedSubcategories);
		// Creates new subcategory doc in firebase
		createSubcategory(budgetData.userID, budgetData.budgetID, newSubcategory);
	};
	const handleDeleteSubcategory = (targetSubcategoryID: string) => {
		// Deleting the target subcategory
		const updatedSubcategories = [...subcategories].filter((subcategory) => subcategory.id !== targetSubcategoryID);
		setSubcategories(updatedSubcategories);
		deleteSubcategory(budgetData.userID, budgetData.budgetID, targetSubcategoryID);

		// Deleting allocations of the target subcategory
	};
	const handleUpdateSubcategoryName = (targetSubcategory: Subcategory, newName: string) => {
		// Updating the target category
		const updatedSubcategories = cloneDeep(subcategories);
		const targetIndex = updatedSubcategories.findIndex((subcategory) => subcategory.id === targetSubcategory.id);
		if (updatedSubcategories[targetIndex].name !== newName) {
			updatedSubcategories[targetIndex].name = newName;
			// Updating subcategory doc in firebase
			updateSubcategory(budgetData.userID, budgetData.budgetID, updatedSubcategories[targetIndex]);
			// Sorting and re-rendering categories
			updatedSubcategories.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
			setSubcategories(updatedSubcategories);
		}
	};

	// MoveSubcategory Subpage
	const showSubpage = (targetSubcategory: Subcategory) => {
		setSubcategoryToMove(targetSubcategory);
		setSubpageClasses([styles.subpage, styles.show]);
	}
	const hideSubpage = () => {
		setSubcategoryToMove(null);
		setSubpageClasses([styles.subpage, styles.hide]);
	}
	const handleMoveSubcategory = (targetSubcategory: Subcategory, newCategory: Category) => {
		// Updating subcategories useState
		const updatedSubcategories = cloneDeep(subcategories);
		const targetIndex = updatedSubcategories.findIndex((subcategory) => subcategory.id === targetSubcategory.id);
		updatedSubcategories[targetIndex].categoryID = newCategory.id;
		setSubcategories(updatedSubcategories);
		// Updating subcategory doc in firebase
		updateSubcategory(budgetData.userID, budgetData.budgetID, updatedSubcategories[targetIndex]);
		hideSubpage();
	};

	// Elements for categories and subcategories
	const editContent: JSX.Element[] = [];
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
				handleDeleteCategory={handleDeleteCategory}
				handleSelectSubcategoryClick={showSubpage}
				handleUpdateCategoryName={handleUpdateCategoryName}
				handleUpdateSubcategoryName={handleUpdateSubcategoryName}
			/>
		);

		editContent.push(itemToRender);
	}

	// Element for adding new category
	const categoryTemplate = (
		<div data-test-id="category-template" className={styles.emptyCategory}>
			<input type="text" onKeyDown={handleCreateCategory} />
			<IconButton
				button={{
					onClick: handleShowCategoryTemplate,
				}}
				src={"/icons/circled-minus.svg"}
				altText={"Button to cancel new category"}
			/>
		</div>
	);

	// Element for MoveSubcategory subpage
	const moveSubcategorySubpage = (
		<section className={classNames(subpageClasses)}>
			{/* Will only render content if a subcategory has been selected */}
			{subcategoryToMove && (
				<>
					<header className={styles.header}>
						<MoveSubcategoryHeader
							subcategory={subcategoryToMove!}
							handleBackClick={hideSubpage}
						/>
					</header>
					<main className={styles.main}>
						<MoveSubcategorySubpage
							subcategory={subcategoryToMove!}
							categories={categories}
							handleMoveSubcategory={handleMoveSubcategory}
						/>
					</main>
				</>
			)}
		</section>
	);

	return (
		<>
			<header className={styles.header}>
				<EditPageHeader handleFinishEdits={handleFinishEdits} handleShowCategoryTemplate={handleShowCategoryTemplate} isShowingCategoryTemplate={isShowingCategoryTemplate} />
			</header>
			<main className={styles.main}>
				{isShowingCategoryTemplate && categoryTemplate}
				<div key={renderKey}>{editContent}</div>
			</main>
			{moveSubcategorySubpage}
		</>
	);
}
