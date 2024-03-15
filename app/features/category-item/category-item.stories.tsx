import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CategoryItem, CategoryItemPropsType } from "./category-item";
import { Subcategory } from "@/firebase/models";

export default {
  title: "Categories/CategoryItem",
  component: CategoryItem,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CategoryItem>;

const Template: StoryFn<CategoryItemPropsType> = (args) => <CategoryItem {...args}/>;

export const Default = Template.bind({});

Default.args = {
    name: "Savings",
    currencyString: "$",
    assigned: 0,
    available: 0,
    subcategories: [{position: 0, categoryID: "3c7cf6c5-c6e8-4ab0-8ed5-dac80b007d39", name: "Gas", id: "d181f1f9-97a1-4037-b57d-cdc1970c594b"} as Subcategory,{name: "Student Loans", position: 1, categoryID: "3c7cf6c5-c6e8-4ab0-8ed5-dac80b007d39", id: "0519a78c-82cc-40d0-86a0-e0a03d5ed2b8"} as Subcategory]
}
