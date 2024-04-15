import { Category, Subcategory } from "@/firebase/models";
import styles from "./move-subcategory-subpage.module.scss";
import classNames from "classnames";

export type MoveSubcategorySubpagePropsType = {
	subcategory: Subcategory;
	categories: Category[];
    handleMoveSubcategory: (category: Category, subcategory: Subcategory) => void;
};
export function MoveSubcategorySubpage(props: MoveSubcategorySubpagePropsType) {
	const { subcategory, categories, handleMoveSubcategory } = props;

	const categoryItems: JSX.Element[] = [];
	for (let i = 0; i < categories.length; i++) {
		const category = categories[i];

		const categoryItemClasses = [styles.categoryItem];
		category.id === subcategory.categoryID && categoryItemClasses.push(styles.selected);

		categoryItems.push(
			<div key={i} className={classNames(categoryItemClasses)} onClick={() => {handleMoveSubcategory(category, subcategory)}}>
                <span className={styles.name}>{category.name}</span>
                <span className={styles.current}>Current</span>
			</div>
		);
	}

	return categoryItems;
}
