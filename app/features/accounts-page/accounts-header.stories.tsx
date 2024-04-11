import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountsHeader } from "./accounts-header";

export default {
  title: "AccountsPage/AccountsHeader",
  component: AccountsHeader,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof AccountsHeader>;

const Template: StoryFn = () => <AccountsHeader/>;

export const Default = Template.bind({});

