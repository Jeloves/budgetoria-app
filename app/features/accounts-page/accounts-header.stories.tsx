import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountsHeader, AccountsHeaderPropsType } from "./accounts-header";

export default {
  title: "AccountsPage/AccountsHeader",
  component: AccountsHeader,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof AccountsHeader>;

const Template: StoryFn<AccountsHeaderPropsType> = (args) => <AccountsHeader {...args}/>;

export const Default = Template.bind({});

Default.args = {
    navigateToBudgetPage: () => {
        alert("Navigating to Budget Page")
    }
}
