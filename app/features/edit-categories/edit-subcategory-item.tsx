import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./edit-subcategory-item.module.scss";
import { Subcategory } from "@/firebase/models";
import { useEffect, useRef, useState } from "react";

export type EditSubcategoryItemPropsType = {
	subcategory: Subcategory;
	categoryID: string;
	handleSelectSubcategoryClick: (subcategoryID: string, name: string) => void;
	handleDeleteSubcategoryClick: (subcategoryID: string, categoryID: string) => void;
};

export function EditSubcategoryItem(props: EditSubcategoryItemPropsType) {
	const { subcategory, categoryID, handleSelectSubcategoryClick, handleDeleteSubcategoryClick } = props;

	return (
		<>
			<section className={classNames(styles.editItem, styles.editSubcategory)}>
				<input type="text" defaultValue={subcategory.name} />
				<IconButton
					button={{
						onClick: () => {handleDeleteSubcategoryClick(subcategory.id, subcategory.categoryID)},
					}}
					src={"/icons/minus.svg"}
					altText={"Button to delete category"}
				/>
				<IconButton
					button={{
						onClick: () => {
							handleSelectSubcategoryClick(subcategory.id, subcategory.name);
						},
					}}
					src={"/icons/reorder.svg"}
					altText={"Button to move subcategory"}
				/>
			</section>
		</>
	);
}
