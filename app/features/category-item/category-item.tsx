import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./category-item.module.scss";
import { Subcategory } from "@/firebase/models";
import { SubcategoryItem } from "../subcategory-item";

export type CategoryItemPropsType = {
	name: string;
	currencyString: string;
	assigned: number;
	available: number;
	subcategories: Subcategory[];
};

export function CategoryItem(props: CategoryItemPropsType) {
	const { name, currencyString, assigned, available, subcategories } = props;

	const handleShowSubcategoriesOnClick = () => {};

	const subcategoryItems: JSX.Element[] = [];
	for (const subcategory of subcategories) {
		subcategoryItems.push(<SubcategoryItem name={subcategory.name} currencyString={currencyString} assigned={0} available={0}></SubcategoryItem>);
	}

	return (
		<>
			<section className={styles.category}>
				<span className={styles.categoryName}>
					<IconButton button={{ onClick: handleShowSubcategoriesOnClick }} src={"/icons/arrow-down.svg"} altText={"Button to show subcategories"} />
					{name}
				</span>
				<div className={classNames(styles.allocation)}>
					<span>Assigned</span>
					{currencyString}
					{(assigned / 1000000).toFixed(2)}
				</div>
				<div className={classNames(styles.allocation)}>
					<span>Available</span>
					{currencyString}
					{(available / 1000000).toFixed(2)}
				</div>
			</section>
			<div>{subcategoryItems}</div>
		</>
	);
}
