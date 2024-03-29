import { EditCategoryItem } from "@/features/edit-categories";
import { Category, Subcategory } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";
import { IconButton } from "../ui";
import styles from "./edit-page.module.scss";
import { useState } from "react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { handleCategoryChanges } from "@/utils/handleCategoryChanges";

export type EditPagePropsType = {
	userID: string;
	budgetID: string;
	categoryData: Category[];
	subcategoryData: Subcategory[];
	handleCancelEditCategoriesClick: () => void;
	handleFinishEditsClick: (deletedCategoriesByID: string[], newCategories: Category[], deletedSubcategoriesByID: string[], newSubcategories: Subcategory[], movedSubcategories: MovedSubcategoryMap[]) => void;
};

export interface MovedSubcategoryMap {
	oldCategoryID: string;
	newCategoryID: string;
	subcategoryID: string;
}

export function EditPage(props: EditPagePropsType) {
	const [categories, setCategories] = useState<Category[]>(props.categoryData);
	const [subcategories, setSubcategories] = useState<Subcategory[]>(props.subcategoryData);
	const [deletedCategoriesByID, setDeletedCategoriesByID] = useState<string[]>([]);
	const [newCategories, setNewCategories] = useState<Category[]>([]);
	const [deletedSubcategoriesByID, setDeletedSubcategoriesByID] = useState<string[]>([]);
	const [newSubcategories, setNewSubcategories] = useState<Subcategory[]>([]);
	const [movedSubcategories, setMovedSubcategories] = useState<MovedSubcategoryMap[]>([]);
	const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
	const [isShowingEmptyCategory, setIsShowingEmptyCategory] = useState<boolean>(false);
	const [isLoadingChanges, setIsLoadingChanges] = useState<boolean>(false);
	const [mainKey, setMainKey] = useState<number>(0);

	const handleDeleteCategoryClick = (categoryID: string) => {
		if (!deletedCategoriesByID.includes(categoryID)) {
			deletedCategoriesByID.push(categoryID);
			const targetCategoryIndex = categories.findIndex((category) => category.id === categoryID);
			const targetCategory = categories[targetCategoryIndex];

			const filteredSubcategories = subcategories.filter((subcategory) => {
				return subcategory.categoryID === targetCategory.id;
			});
			for (const subcategory of filteredSubcategories) {
				if (!deletedSubcategoriesByID.includes(subcategory.id)) {
					deletedSubcategoriesByID.push(subcategory.id);
				}
			}
			categories.splice(targetCategoryIndex, 1);
			setMainKey(mainKey === 0 ? 1 : 0);
		}
	};
	const handleAddCategory = (category: Category) => {
		if (!newCategories.includes(category)) {
			newCategories.push(category);
			categories.push(category);
			categories.sort((a, b) => {
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
	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const inputValue = event.currentTarget.value;
			if (inputValue) {
				handleAddCategory(new Category(uuidv4(), inputValue));
				setIsShowingEmptyCategory(false);
			} else {
				setIsShowingEmptyCategory(false);
			}
		}
	};

	const handleDeleteSubcategoryClick = (subcategoryID: string) => {
		if (!deletedSubcategoriesByID.includes(subcategoryID)) {
			deletedSubcategoriesByID.push(subcategoryID);
			const targetSubcategoryIndex = subcategories.findIndex((subcategory) => {
				subcategory.id === subcategoryID;
			});
			subcategories.splice(targetSubcategoryIndex, 1);
			setMainKey(mainKey === 0 ? 1 : 0);
		}
	};
	const handleAddSubcategoryClick = (subcategory: Subcategory) => {
		if (!newSubcategories.includes(subcategory)) {
			newSubcategories.push(subcategory);
			subcategories.push(subcategory);
			subcategories.sort((a, b) => {
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
	const handleSelectSubcategoryClick = (subcategory: Subcategory) => {
		console.log("Selected:", subcategory);
		setSelectedSubcategory(subcategory);
		setMainKey(mainKey === 0 ? 1 : 0);
	};

	const handleSelectCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const oldCategoryID = selectedSubcategory!.categoryID;
		const newCategoryID = event.currentTarget.id;
		if (oldCategoryID !== newCategoryID) {
			movedSubcategories.push({ oldCategoryID: oldCategoryID, newCategoryID: newCategoryID, subcategoryID: selectedSubcategory!.id });

			const targetSubcategoryIndex = subcategories.findIndex((subcategory) => subcategory.id === selectedSubcategory!.id);
			subcategories[targetSubcategoryIndex].categoryID = newCategoryID;

			setSelectedSubcategory(null);
			setMainKey(mainKey === 0 ? 1 : 0);
		}
	};

	const handleDoneClick = () => {
		setIsLoadingChanges(true);
		props.handleFinishEditsClick(deletedCategoriesByID, newCategories, deletedSubcategoriesByID, newSubcategories, movedSubcategories);
	};

	const editHeader = (
		<header className={styles.header}>
			<div>
				<button className={classNames(styles.textButton, styles.cancel)} onClick={props.handleCancelEditCategoriesClick}>
					Cancel
				</button>
			</div>
			Edit Categories
			<div>
				<IconButton
					button={{
						onClick: () => {
							setIsShowingEmptyCategory(!isShowingEmptyCategory);
						},
					}}
					src={isShowingEmptyCategory ? "/icons/delete-folder.svg" : "/icons/add-folder.svg"}
					altText="Button to add new category"
				/>
				<button className={classNames(styles.textButton, styles.finish)} onClick={handleDoneClick}>
					Done
				</button>
			</div>
		</header>
	);

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
		})
		editContent.push(
			<EditCategoryItem
				key={i}
				category={category}
				subcategories={filteredSubcategories}
				handleDeleteCategoryClick={handleDeleteCategoryClick}
				handleDeleteSubcategoryClick={handleDeleteSubcategoryClick}
				handleAddSubcategoryClick={handleAddSubcategoryClick}
				handleSelectSubcategoryClick={handleSelectSubcategoryClick}
			/>
		);
		categorySelectionContent.push(
			<button key={i} id={category.id} onClick={handleSelectCategoryClick} className={styles.categoryOption}>
				{category.name}
			</button>
		);
	}

	return (
		<>
			{isLoadingChanges ? <div className={styles.loading}>Loading</div> : null}
			{selectedSubcategory ? categorySelectionHeader : editHeader}
			<main key={mainKey} className={styles.content}>
				{isShowingEmptyCategory ? (
					<div className={styles.emptyCategory}>
						<input type="text" onKeyDown={handleEnterKeyDown} />
						<IconButton
							button={{
								onClick: () => {
									setIsShowingEmptyCategory(false);
								},
							}}
							src={"/icons/circled-minus.svg"}
							altText={"Button to cancel new subcategory"}
						/>
					</div>
				) : null}
				{selectedSubcategory ? categorySelectionContent : editContent}
			</main>
		</>
	);
}
