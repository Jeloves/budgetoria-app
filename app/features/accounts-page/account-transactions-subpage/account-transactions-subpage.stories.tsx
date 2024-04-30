import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountTransactionsSubpage, AccountTransactionsSubpagePropsType } from "./account-transactions-subpage";
import { Account, Subcategory, Transaction } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";

export default {
	title: "AccountsPage/AccountTransactions",
	component: AccountTransactionsSubpage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof AccountTransactionsSubpage>;

const Template: StoryFn<AccountTransactionsSubpagePropsType> = (args) => <AccountTransactionsSubpage {...args} />;

export const Default = Template.bind({});


Default.args = {
	subcategories: [],
	accounts: [],
	showingAllAccounts: true,
	transactions: [],
	handleBackClick: () => {alert("Returning to AccountsPage")}
};
