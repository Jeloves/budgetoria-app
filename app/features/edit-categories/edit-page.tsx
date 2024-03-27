import { EditCategoryItem } from "@/features/edit-categories";
import { Category, Subcategory } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";
import { IconButton } from "../ui";
import styles from "./edit-page.module.scss";
import { useState } from "react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";

export type EditPagePropsType = {
	categoryData: Category[];
	handleCancelEditCategoriesClick: () => void;
};

export interface MovedSubcategoryMap {
	oldCategoryID: string;
	newCategoryID: string;
	subcategoryID: string;
}

export function EditPage(props: EditPagePropsType) {
	const [categories, setCategories] = useState<Category[]>(props.categoryData);
	const [deletedCategoriesByID, setDeletedCategoriesByID] = useState<string[]>([]);
	const [newCategories, setNewCategories] = useState<Category[]>([]);
	const [deletedSubcategoriesByID, setDeletedSubcategoriesByID] = useState<string[]>([]);
	const [newSubcategories, setNewSubcategories] = useState<Subcategory[]>([]);
	const [movedSubcategories, setMovedSubcategories] = useState<MovedSubcategoryMap[]>([]);
	const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
	const [isShowingEmptyCategory, setIsShowingEmptyCategory] = useState<boolean>(false);
	const [mainKey, setMainKey] = useState<number>(0);

	const handleDeleteCategoryClick = (categoryID: string) => {
		if (!deletedCategoriesByID.includes(categoryID)) {
			deletedCategoriesByID.push(categoryID);
			const targetCategoryIndex = categories.findIndex((category) => category.id === categoryID);
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

			const targetOldCategoryIndex = categories.findIndex((category) => category.id === oldCategoryID);
			const targetNewCategoryIndex = categories.findIndex((category) => category.id === newCategoryID);
			const targetOldSubcategoryIndex = categories[targetOldCategoryIndex].subcategories.findIndex((subcategory) => subcategory.id === selectedSubcategory!.id);

			categories[targetOldCategoryIndex].subcategories.splice(targetOldSubcategoryIndex, 1);
			categories[targetNewCategoryIndex].subcategories.push(selectedSubcategory!);
			categories[targetNewCategoryIndex].subcategories.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});

			setSelectedSubcategory(null);
			setMainKey(mainKey === 0 ? 1 : 0);
			console.log(movedSubcategories);
		}
	};

	const editHeader = (
		<header className={styles.header}>
			<div>
				<button className={classNames(styles.textButton, styles.cancel)} onClick={props.handleCancelEditCategoriesClick}>Cancel</button>
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
				<button className={classNames(styles.textButton, styles.finish)}>Done</button>
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
		if (category.id === NIL_UUID) {
			continue;
		}
		editContent.push(
			<EditCategoryItem
				key={i}
				category={category}
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

	console.log(categories)

	return (
		<>
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
