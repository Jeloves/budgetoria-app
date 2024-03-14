import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { IconButton, IconButtonPropsType } from "./icon-button"

export default {
  title: "UI/IconButton",
  component: IconButton,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof IconButton>;

const Template: StoryFn<IconButtonPropsType> = (args) => <IconButton {...args}/>;

export const Default = Template.bind({});

Default.args = {
    src: "/icons/edit.svg",
    altText: "Button to edit budget page"
}
