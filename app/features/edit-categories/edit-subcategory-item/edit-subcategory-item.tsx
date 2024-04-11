import classNames from "classnames";
import { IconButton } from "../../ui";
import styles from "./edit-subcategory-item.module.scss";
import { Subcategory } from "@/firebase/models";

export type EditSubcategoryItemPropsType = {
	subcategory: Subcategory;
	handleDeleteSubcategoryClick: (subcategoryID: string) => void;
	handleSelectSubcategoryClick: (subcategory: Subcategory) => void;
};

export function EditSubcategoryItem(props: EditSubcategoryItemPropsType) {
	const { subcategory, handleSelectSubcategoryClick, handleDeleteSubcategoryClick } = props;

	return (
		<>
			<div className={styles.editSubcategoryItem}>
				<input type="text" defaultValue={subcategory.name} />
				<IconButton
					button={{
						onClick: () => {
							handleDeleteSubcategoryClick(subcategory.id)
						},
					}}
					src={"/icons/minus.svg"}
					altText={"Button to delete category"}
				/>
				<IconButton
					button={{
						onClick: () => {
							handleSelectSubcategoryClick(subcategory);
						},
					}}
					src={"/icons/reorder.svg"}
					altText={"Button to move subcategory"}
				/>
			</div>
		</>
	);
}
