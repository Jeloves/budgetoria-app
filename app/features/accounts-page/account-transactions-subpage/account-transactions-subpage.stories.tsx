import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountTransactionsSubpage, AccountTransactionsSubpagePropsType } from "./account-transactions-subpage";
import { Account, Subcategory, Transaction } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";
import { getMockData } from "@/mock-data/mock-budget";

export default {
	title: "AccountsPage/AccountTransactions",
	component: AccountTransactionsSubpage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof AccountTransactionsSubpage>;

const Template: StoryFn<AccountTransactionsSubpagePropsType> = (args) => <AccountTransactionsSubpage {...args} />;

export const Default = Template.bind({});

const mock = getMockData();

Default.args = {
	subcategories: mock.subcategories,
	accounts: mock.accounts,
	showingAllAccounts: true,
	transactions: mock.transactions,
	handleBackClick: () => {alert("Returning to AccountsPage")}
};
