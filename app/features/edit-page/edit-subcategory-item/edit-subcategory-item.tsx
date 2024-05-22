import { IconButton } from "../../ui";
import styles from "./edit-subcategory-item.module.scss";
import { Category, Subcategory } from "@/firebase/models";

export type EditSubcategoryItemPropsType = {
	subcategory: Subcategory;
	handleDeleteSubcategoryClick: (subcategoryID: string) => void;
	handleSelectSubcategoryClick: (subcategory: Subcategory) => void;
	handleUpdateSubcategoryName: (targetSubcategory: Subcategory, newName: string) => void;
};

export function EditSubcategoryItem(props: EditSubcategoryItemPropsType) {
	const { subcategory, handleSelectSubcategoryClick, handleDeleteSubcategoryClick, handleUpdateSubcategoryName} = props;

	const handleUpdateSubcategoryNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const newName = event.currentTarget.value;
			if (newName) {
				handleUpdateSubcategoryName(subcategory, newName);
			}
		}
	}

	return (
		<>
			<div  data-test-id="edit-subcategory-item" className={styles.editSubcategoryItem}>
				<input type="text" onKeyDown={handleUpdateSubcategoryNameKeyDown} defaultValue={subcategory.name} />
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
							handleSelectSubcategoryClick(subcategory)
						},
					}}
					src={"/icons/reorder.svg"}
					altText={"Button to move subcategory"}
				/>
			</div>
		</>
	);
}
