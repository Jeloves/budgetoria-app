import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CategoriesSubpage, CategoriesSubpagePropsType } from "./categories-subpage";
import { v4 as uuidv4 } from "uuid";
import { Category, Subcategory } from "@/firebase/models";

export default {
	title: "Transaction/CategoriesSubpage",
	component: CategoriesSubpage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof CategoriesSubpage>;

const Template: StoryFn<CategoriesSubpagePropsType> = (args) => <CategoriesSubpage {...args} />;

export const Default = Template.bind({});

const categoryEssential = new Category(uuidv4(), "Essential");
const categoryNonessential = new Category(uuidv4(), "Nonessential");
const categorySavings = new Category(uuidv4(), "Savings");
const categorySubscriptions = new Category(uuidv4(), "Subscriptions");

const subcategory1 = new Subcategory(uuidv4(), "Electricity", categoryEssential.id);
const subcategory2 = new Subcategory(uuidv4(), "Food", categoryEssential.id);
const subcategory3 = new Subcategory(uuidv4(), "Gas", categoryEssential.id);
const subcategory4 = new Subcategory(uuidv4(), "Ice Cream", categoryNonessential.id);
const subcategory5 = new Subcategory(uuidv4(), "Video Games", categoryNonessential.id);
const subcategory6 = new Subcategory(uuidv4(), "Student Loans", categorySavings.id);
const subcategory7 = new Subcategory(uuidv4(), "Crunchyroll", categorySubscriptions.id);
const subcategory8 = new Subcategory(uuidv4(), "Netflix", categorySubscriptions.id);
const subcategory9 = new Subcategory(uuidv4(), "Other", categorySubscriptions.id);
const subcategory10 = new Subcategory(uuidv4(), "Zoomies", categorySubscriptions.id);

Default.args = {
	selectedSubcategoryID: subcategory4.id,
	categories: [categoryEssential, categoryNonessential, categorySavings, categorySubscriptions],
	subcategories: [subcategory1, subcategory2, subcategory3, subcategory4, subcategory5, subcategory6, subcategory7, subcategory8, subcategory9, subcategory10],
};
