import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountsHeader } from "./accounts-header";
import { Account } from "@/firebase/models";

export default {
  title: "AccountsPage/AccountsHeader",
  component: AccountsHeader,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof AccountsHeader>;

const Template: StoryFn = (args) => <AccountsHeader {...args}/>;

export const Default = Template.bind({});

Default.args = {
}
