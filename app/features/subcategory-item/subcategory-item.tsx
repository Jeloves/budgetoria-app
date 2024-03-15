import classNames from "classnames";
import { IconButton } from "../ui";
import styles from "./subcategory-item.module.scss";

export type SubcategoryItemPropsType = {
	name: string;
	currencyString: string;
	assigned: number;
	available: number;
};

export function SubcategoryItem(props: SubcategoryItemPropsType) {
	const { name, currencyString, assigned, available } = props;

	return (
		<section className={styles.subcategory}>
			<span className={styles.subcategoryName}>{name}</span>
			<div className={classNames(styles.allocation)}>
				{currencyString}
				{(assigned / 1000000).toFixed(2)}
			</div>
			<div className={classNames(styles.allocation)}>
				<span>
					{currencyString}
					{(available / 1000000).toFixed(2)}
				</span>
			</div>
		</section>
	);
}
