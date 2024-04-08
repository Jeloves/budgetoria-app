import { IconButton } from "@/features/ui";
import classNames from "classnames";
import styles from "./edit-page-header.module.scss";
import { useState } from "react";

export type EditPageHeaderPropsType = {
	handleCancelEdits: () => void;
	handleConfirmEdits: () => void;
	handleShowNewCategory: () => void;
};

export function EditPageHeader(props: EditPageHeaderPropsType) {
	const { handleConfirmEdits, handleCancelEdits, handleShowNewCategory } = props;
	const [isShowingNewCategory, setIsShowingNewCategory] = useState<boolean>(false);

	return (
		<>
			<div className={styles.headerLeft}>
				<button className={styles.cancel} onClick={handleCancelEdits}>
					Cancel
				</button>
			</div>
			Edit Categories
			<div className={styles.headerRight}>
				<IconButton
					button={{
						onClick: () => {
							setIsShowingNewCategory(!isShowingNewCategory);
							handleShowNewCategory;
						},
					}}
					src={isShowingNewCategory ? "/icons/delete-folder.svg" : "/icons/add-folder.svg"}
					altText="Button to add new category"
				/>
				<button className={styles.confirm} onClick={handleConfirmEdits}>
					Done
				</button>
			</div>
		</>
	);
}
