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
	handleCreateSubcategory: (subcategory: Subcategory) => void;
	handleDeleteSubcategory: (subcategoryID: string) => void;
	handleDeleteCategoryClick: (categoryID: string) => void;
	handleSelectSubcategoryClick: (subcategory: Subcategory) => void;
};

export function EditCategoryItem(props: EditCategoryItemPropsType) {
	const { handleCreateSubcategory, handleDeleteSubcategory, handleDeleteCategoryClick, handleSelectSubcategoryClick } = props;

	const [category, setCategory] = useState<Category>(props.category);
	const [subcategories, setSubcategories] = useState<Subcategory[]>(props.subcategories);
	const [isShowingEmptySubcategory, setIsShowingEmptySubcategory] = useState<boolean>(false);
	const [mainKey, setMainKey] = useState<number>(0);


	const handleDisplayNewSubcategory = () => {
		setIsShowingEmptySubcategory(!isShowingEmptySubcategory);
	};

	const handleCreateSubcategoryClick = (name: string) => {
		const newSubcategory = new Subcategory(uuidv4(), name, category.id)
		const updatedSubcategories = [...subcategories, newSubcategory];
		updatedSubcategories.sort((a, b) => {
			if ((a.name).toLowerCase() < (b.name).toLowerCase()) {
				return -1;
			} else if ((a.name).toLowerCase() > (b.name).toLowerCase()) {
				return 1;
			} else {	
				return 0;
			}
		});
		setSubcategories(updatedSubcategories);
		setMainKey(mainKey === 0 ? 1 : 0);
		handleCreateSubcategory(newSubcategory);
	}
	const handleDeleteSubcategoryClick = (subcategoryID: string) => {
		const updatedSubcategories = subcategories.filter((subcategory) => subcategory.id !== subcategoryID);
		setSubcategories(updatedSubcategories);
		setMainKey(mainKey === 0 ? 1 : 0);
		handleDeleteSubcategory(subcategoryID);
	}

	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const inputValue = event.currentTarget.value;
			if (inputValue) {
				handleCreateSubcategoryClick(inputValue);
			}
			setIsShowingEmptySubcategory(false);
		}
	};

	let subcategoryEditItems: JSX.Element[] = [];
	for (let i = 0; i < subcategories.length; i++) {
		const subcategory = subcategories[i];
		subcategoryEditItems.push(<EditSubcategoryItem key={i} subcategory={subcategory} handleDeleteSubcategoryClick={handleDeleteSubcategoryClick} handleSelectSubcategoryClick={handleSelectSubcategoryClick} />);
	}

	let newSubcategoryItem: JSX.Element = (
		<div className={styles.emptySubcategory}>
			<input type="text" onKeyDown={handleEnterKeyDown} />
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
			<div className={styles.editCategoryItem}>
				<input type="text" defaultValue={category.name} />
				<IconButton
					button={{
						onClick: () => {
							handleDeleteCategoryClick(category.id);
						},
					}}
					src={"/icons/circled-minus.svg"}
					altText={"Button to delete category"}
				/>
				<IconButton button={{ onClick: handleDisplayNewSubcategory }} src={isShowingEmptySubcategory ? "/icons/minus.svg" : "/icons/circled-plus.svg"} altText={"Button to show or hide new subcategory template"} />
			</div>

			<div key={mainKey} className={styles.editSubcategoryItems}>
				{isShowingEmptySubcategory && newSubcategoryItem}
				{subcategoryEditItems}
			</div>
		</>
	);
}
