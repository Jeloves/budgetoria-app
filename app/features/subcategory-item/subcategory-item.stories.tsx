import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { SubcategoryItem, SubcategoryItemPropsType } from "./subcategory-item";
import { Subcategory } from "@/firebase/models";

export default {
	title: "SubcategoryItem",
	component: SubcategoryItem,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof SubcategoryItem>;

const Template: StoryFn<SubcategoryItemPropsType> = (args) => <SubcategoryItem {...args} />;

export const Default = Template.bind({});

Default.args = {
	subcategoryAllocation: {
		subcategory: new Subcategory("subcatID", "Food", "categoryID"),
		assignedBalance: 250000000,
		availableBalance: 200000000,
	},
	handleUpdateAssignedAllocation: (changeInSubcategoryAssignedValue: number, newSubcategoryAssignedBalance: number, subcategoryID: string) => {
		console.log("Updating subcategory allocation");
		console.log("    subcatID", subcategoryID);
		console.log("    newBalance", newSubcategoryAssignedBalance);
		console.log("    changeInBalance", changeInSubcategoryAssignedValue);
	},
};
