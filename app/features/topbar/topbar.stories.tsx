import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Topbar } from "./topbar"

export default {
  title: "Header/Topbar",
  component: Topbar,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Topbar>;

const Template: StoryFn = () => <Topbar/>;

export const Default = Template.bind({});
