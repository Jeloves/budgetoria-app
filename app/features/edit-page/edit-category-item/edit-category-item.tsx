import classNames from "classnames";
import { IconButton } from "../../ui";
import styles from "./edit-category-item.module.scss";
import { Category, Subcategory } from "@/firebase/models";
import { EditSubcategoryItem } from "../edit-subcategory-item/edit-subcategory-item";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type EditCategoryItemPropsType = {
	category: Category;
	subcategories: Subcategory[];
	handleCreateSubcategory: (name: string, categoryID: string) => void;
	handleDeleteSubcategory: (subcategoryID: string) => void;
	handleDeleteCategory: (categoryID: string) => void;
	handleSelectSubcategoryClick: (subcategory: Subcategory) => void;
	handleUpdateCategoryName: (targetCategory: Category, newName: string) => void;
	handleUpdateSubcategoryName: (targetSubcategory: Subcategory, newName: string) => void;
};

export function EditCategoryItem(props: EditCategoryItemPropsType) {
	const { handleCreateSubcategory, handleDeleteSubcategory, handleDeleteCategory, handleSelectSubcategoryClick, handleUpdateCategoryName, handleUpdateSubcategoryName } = props;

	const [category, setCategory] = useState<Category>(props.category);
	const [subcategories, setSubcategories] = useState<Subcategory[]>(props.subcategories);
	const [isShowingEmptySubcategory, setIsShowingEmptySubcategory] = useState<boolean>(false);
	const [mainKey, setMainKey] = useState<number>(0);

	const handleDisplayNewSubcategory = () => {
		setIsShowingEmptySubcategory(!isShowingEmptySubcategory);
	};

	const handleDeleteSubcategoryClick = (subcategoryID: string) => {
		const updatedSubcategories = subcategories.filter((subcategory) => subcategory.id !== subcategoryID);
		setSubcategories(updatedSubcategories);
		setMainKey(mainKey === 0 ? 1 : 0);
		handleDeleteSubcategory(subcategoryID);
	};
	const handleCreateSubcategoryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const name = event.currentTarget.value;
			if (name) {
				handleCreateSubcategory(name, category.id);
				handleDisplayNewSubcategory();
			} else {
				alert("A name must be inputted");
			}
		}
	};

	const handleUpdateCategoryNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const newName = event.currentTarget.value;
			if (newName) {
				handleUpdateCategoryName(category, newName);
				(event.target as HTMLInputElement).blur();
			} else {
				alert("A category name must be inputted");
			}
		}
	};

	let subcategoryEditItems: JSX.Element[] = [];
	for (let i = 0; i < subcategories.length; i++) {
		const subcategory = subcategories[i];
		subcategoryEditItems.push(
			<EditSubcategoryItem key={i} subcategory={subcategory} handleDeleteSubcategoryClick={handleDeleteSubcategoryClick} handleSelectSubcategoryClick={handleSelectSubcategoryClick} handleUpdateSubcategoryName={handleUpdateSubcategoryName} />
		);
	}

	let subcategoryTemplate: JSX.Element = (
		<div data-test-id="subcategory-template" className={styles.emptySubcategory}>
			<input type="text" onKeyDown={handleCreateSubcategoryKeyDown} />
			<IconButton
				button={{
					onClick: () => {
						setIsShowingEmptySubcategory(false);
					},
				}}
				src={"/icons/circled-minus.svg"}
				altText={"Button to cancel new subcategory"}
			/>
		</div>
	);

	return (
		<>
			<div data-test-id="edit-category-item" className={styles.editCategoryItem}>
				<input type="text" onKeyDown={handleUpdateCategoryNameKeyDown} defaultValue={category.name} />
				<IconButton
					button={{
						onClick: () => {
							handleDeleteCategory(category.id);
						},
					}}
					src={"/icons/circled-minus.svg"}
					altText={"Button to delete category"}
				/>
				<IconButton button={{ onClick: handleDisplayNewSubcategory }} src={isShowingEmptySubcategory ? "/icons/minus.svg" : "/icons/circled-plus.svg"} altText={"Button to show or hide new subcategory template"} />
			</div>

			<div key={mainKey}>
				{isShowingEmptySubcategory && subcategoryTemplate}
				{subcategoryEditItems}
			</div>
		</>
	);
}
