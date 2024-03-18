import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Topbar, TopbarPropsType } from "./topbar"

export default {
  title: "Header/Topbar",
  component: Topbar,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Topbar>;

const Template: StoryFn<TopbarPropsType> = (args) => <Topbar {...args}/>;

export const Default = Template.bind({});

Default.args = {
  month: 2,
  year: 2024,
  handleDateChangeOnClick: (monthIndex: number, year: number) => {
    alert("date changed")
  },
}
