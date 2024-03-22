import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./edit-item.module.scss";
import { Category, Subcategory } from "@/firebase/models";

export type EditItemPropsType = {
	category: Category | null;
	subcategory: Subcategory | null;
};

export function EditItem(props: EditItemPropsType) {
	const { category, subcategory } = props;

	const handleDeleteCategory = () => {
		alert("category will be deleted.");
	};
	const handleMoveCategory = () => {
		alert("category will be moved.");
	};

	const handleAddSubcategory = () => {
		alert("SUBcategory will be added.");
	};
	const handleDeleteSubcategory = () => {
		alert("SUBcategory will be deleted.");
	};
	const handleMoveSubcategory = () => {
		alert("SUBcategory will be moved.");
	};

	let editItemElement: JSX.Element;

	if (category && subcategory === null) {
		return (
			<section className={classNames(styles.editItem, styles.editCategory)}>
				<input type="text" defaultValue={category?.name} />
				<IconButton button={{ onClick: handleDeleteCategory }} src={"/icons/circled-minus.svg"} altText={"Button to delete category"} />
				<IconButton button={{ onClick: handleAddSubcategory }} src={"/icons/circled-plus.svg"} altText={"Button to add subcategory"} />
				<IconButton button={{ onClick: handleDeleteCategory }} src={"/icons/menu.svg"} altText={"Button to move category"} />
			</section>
		);
	} else if (subcategory && category === null) {
		return (
			<>
				<section className={classNames(styles.editItem, styles.editSubcategory)}>
					<input type="text" defaultValue={subcategory?.name} />
					<IconButton button={{ onClick: handleDeleteSubcategory }} src={"/icons/circled-minus.svg"} altText={"Button to delete category"} />
					<IconButton button={{ onClick: handleMoveSubcategory }} src={"/icons/menu.svg"} altText={"Button to move category"} />
				</section>
			</>
		);
	}
}
