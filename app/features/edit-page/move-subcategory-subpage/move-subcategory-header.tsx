import { Subcategory } from "@/firebase/models";
import styles from "./move-subcategory-header.module.scss";

export type MoveSubcategoryHeaderPropsType = {
	subcategory: Subcategory;
	handleBackClick: () => void;
};
export function MoveSubcategoryHeader(props: MoveSubcategoryHeaderPropsType) {
	const { subcategory, handleBackClick } = props;
	return (
		<>
			<button className={styles.button} onClick={handleBackClick}>
				{/* eslint-disable-next-line @next/next/no-img-element*/}
				<img src="/icons/arrow-left.svg" alt="Button to return to Edit Page" />
				Return
			</button>
			<div className={styles.content}>
				Move <span>{subcategory.name}</span> to...
			</div>
		</>
	);
}
