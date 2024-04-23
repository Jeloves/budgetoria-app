import { IconButton } from "@/features/ui";
import classNames from "classnames";
import styles from "./edit-page-header.module.scss";
import { useState } from "react";

export type EditPageHeaderPropsType = {
	handleFinishEdits: () => void;
	handleShowCategoryTemplate: () => void;
	isShowingCategoryTemplate: boolean;
};

export function EditPageHeader(props: EditPageHeaderPropsType) {
	const { handleFinishEdits, handleShowCategoryTemplate, isShowingCategoryTemplate } = props;

	return (
		<>
			<IconButton
				button={{
					onClick: () => {
						handleShowCategoryTemplate();
					},
				}}
				src={isShowingCategoryTemplate ? "/icons/delete-folder.svg" : "/icons/add-folder.svg"}
				altText="Button to add new category"
			/>
			Edit Categories
			<button className={styles.confirm} onClick={handleFinishEdits}>
				Done
			</button>
		</>
	);
}
