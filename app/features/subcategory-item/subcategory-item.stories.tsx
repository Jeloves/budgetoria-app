import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { SubcategoryItem, SubcategoryItemPropsType } from "./subcategory-item";

export default {
  title: "Categories/SubcategoryItem",
  component: SubcategoryItem,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof SubcategoryItem>;

const Template: StoryFn<SubcategoryItemPropsType> = (args) => <SubcategoryItem {...args}/>;

export const Default = Template.bind({});

Default.args = {
    name: "Student Loans",
    currencyString: "$",
    assigned: 0,
    available: 0,
}
