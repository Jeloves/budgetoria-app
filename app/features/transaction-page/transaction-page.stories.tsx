import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { TransactionPage, TransactionPagePropsType } from "./transaction-page";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";
import { time } from "console";

export default {
	title: "Transaction/TransactionPage",
	component: TransactionPage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof TransactionPage>;

const Template: StoryFn<TransactionPagePropsType> = (args) => <TransactionPage {...args} />;

export const Default = Template.bind({});

const timestamp = new Timestamp(1704114488, 745000000); // Jan 1, 2024 at 8:08:08AM UTC-5

Default.args = {
	payees: ["Crunchyroll", "Royal Farms", "Steam", "Amazon", "Spotify", "Dave's Hot Chicken", "Ebay", "FAFSA", "Weis Market", "Netflix"],
	categories: [
        new Category("categoryID1", "Essential"), 
        new Category("categoryID2", "Nonessential"), 
        new Category("categoryID3", "Subscriptions"),
    ],
    subcategories: [
		new Subcategory("subcategoryID1A", "Gas", "categoryID1"),
		new Subcategory("subcategoryID2A", "Groceries", "categoryID1"),
        new Subcategory("subcategoryID2A", "Student Loans", "categoryID1"),

        new Subcategory("subcategoryID1B", "Fast Food", "categoryID2"),
        new Subcategory("subcategoryID2B", "Online Shopping", "categoryID2"),
		new Subcategory("subcategoryID3B", "Video Games", "categoryID2"),

		new Subcategory("subcategoryID1C", "Crunchyroll", "categoryID3"),
		new Subcategory("subcategoryID2C", "Netflix", "categoryID3"),
		new Subcategory("subcategoryID3C", "Spotify", "categoryID3"),
	],
    accounts: [
        new Account("accountID1", "Checkings", 2000000000, 1638223000),
        new Account("accountID2", "Credit", 0, 0),
        new Account("accountID3", "Savings", 1000000000, 1000000000)
    ],
    transaction: new Transaction("transactionID", timestamp, "", "", true, 0, false, "", "", ""),
};
