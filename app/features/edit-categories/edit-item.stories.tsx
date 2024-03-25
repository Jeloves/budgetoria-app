import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { EditItem, EditItemPropsType } from "./edit-item"
import { Category, Subcategory } from "@/firebase/models";

export default {
  title: "Categories/EditItem",
  component: EditItem,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof EditItem>;

const Template: StoryFn<EditItemPropsType> = (args) => <EditItem {...args}/>;

export const Default = Template.bind({});

Default.args = {
    category: null,
    subcategory: new Subcategory("id", "Crunchyroll", "catID"),
}
