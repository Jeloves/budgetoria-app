import { IconButton } from "@/features/ui";
import classNames from "classnames";
import styles from "./edit-page-header.module.scss";
import { useState } from "react";

export type EditPageHeaderPropsType = {
	handleCancelEdits: () => void;
	handleConfirmEdits: () => void;
	handleShowCategoryTemplate: () => void;
	isShowingCategoryTemplate: boolean;
};

export function EditPageHeader(props: EditPageHeaderPropsType) {
	const { handleConfirmEdits, handleCancelEdits, handleShowCategoryTemplate, isShowingCategoryTemplate } = props;

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
							handleShowCategoryTemplate();
						},
					}}
					src={isShowingCategoryTemplate ? "/icons/delete-folder.svg" : "/icons/add-folder.svg"}
					altText="Button to add new category"
				/>
				<button className={styles.confirm} onClick={handleConfirmEdits}>
					Done
				</button>
			</div>
		</>
	);
}
