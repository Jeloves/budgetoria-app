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
	handleDeleteCategoryClick: (categoryID: string) => void;
	handleDeleteSubcategoryClick: (subcategoryID: string, categoryID: string) => void;
	handleAddSubcategoryClick: (subcategory: Subcategory) => void;
	handleSelectSubcategoryClick: (subcategory: Subcategory) => void;
};

export function EditCategoryItem(props: EditCategoryItemPropsType) {
	const { category, subcategories, handleDeleteCategoryClick, handleDeleteSubcategoryClick, handleAddSubcategoryClick, handleSelectSubcategoryClick } = props;
	const [isShowingEmptySubcategory, setIsShowingEmptySubcategory] = useState<boolean>(false);

	const handleDisplayNewSubcategory = () => {
		setIsShowingEmptySubcategory(true);
	};

	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const inputValue = event.currentTarget.value;
			if (inputValue) {
				handleAddSubcategoryClick(new Subcategory(uuidv4(), inputValue, category.id));
				setIsShowingEmptySubcategory(false);
			} else {
				setIsShowingEmptySubcategory(false);
			}
		}
	};

	let subcategoryEditItems: JSX.Element[] = [];
	for (let i = 0; i < subcategories.length; i++) {
		const subcategory = subcategories[i];
		subcategoryEditItems.push(
			<EditSubcategoryItem
				key={i}
				subcategory={subcategory}
				handleDeleteSubcategoryClick={handleDeleteSubcategoryClick}
				handleSelectSubcategoryClick={handleSelectSubcategoryClick}
			/>
		);
	}

	return (
		<section className={styles.editCategoryContainer}>
			<div className={styles.editCategoryContent}>
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
				<div className={isShowingEmptySubcategory ? styles.showingEmptySubcategory : ""}>
					<IconButton button={{ onClick: handleDisplayNewSubcategory }} src={"/icons/circled-plus.svg"} altText={"Button to add subcategory"} />
				</div>
			</div>
			{isShowingEmptySubcategory ? (
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
			) : null}
			{subcategoryEditItems}
		</section>
	);
}
