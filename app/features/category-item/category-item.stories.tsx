import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CategoryItem, CategoryItemPropsType } from "./category-item";

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
}
