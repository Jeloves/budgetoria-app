import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountsPage, AccountsPagePropsType } from "./accounts-page";
import { Account } from "@/firebase/models";

export default {
  title: "AccountsPage/AccountsPage",
  component: AccountsPage,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof AccountsPage>;

const Template: StoryFn<AccountsPagePropsType> = (args) => <AccountsPage {...args}/>;

export const Default = Template.bind({});

Default.args = {
  accounts: [
    new Account("accountID1", "Checkings", 2000000000, 1638223000),
    new Account("accountID2", "Credit", 0, 0),
    new Account("accountID3", "Savings", 1000000000, 1000000000)
  ]
}
