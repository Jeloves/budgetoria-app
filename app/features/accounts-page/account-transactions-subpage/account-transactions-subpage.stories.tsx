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

const timestamp = new Timestamp(1704114488, 745000000); // Jan 1, 2024 at 8:08:08AM UTC-5
const timestamp2 = Timestamp.fromDate(new Date(2024, 1, 12, 8, 10)); // Feb 12 2024 at 8:10 AM
const timestamp3 = Timestamp.fromDate(new Date(2024, 1, 13, 8, 10)); // Feb 13 2024 at 8:10 AM
const timestamp5 = Timestamp.fromDate(new Date(2024, 2, 8, 5, 5)); // Mar 8 2024 at 5:05 AM

Default.args = {
	account: new Account("accountID", "Checkings", 1000000000, 2203690000),
    subcategories: [
		new Subcategory("subcategoryID1A", "Test Subcategory 1A", "categoryID1"),
		new Subcategory("subcategoryID2A", "Test Subcategory 2A", "categoryID1"),
		new Subcategory("subcategoryID3A", "Test Subcategory 3A", "categoryID1"),
		new Subcategory("subcategoryID4A", "Test Subcategory 4A", "categoryID1"),

		new Subcategory("subcategoryID1B", "Test Subcategory 1B", "categoryID2"),
		new Subcategory("subcategoryID2B", "Test Subcategory 2B", "categoryID2"),
		new Subcategory("subcategoryID3B", "Test Subcategory 3B", "categoryID2"),
		new Subcategory("subcategoryID4B", "Test Subcategory 4B", "categoryID2"),

		new Subcategory("subcategoryID1C", "Test Subcategory 1C", "categoryID3"),
		new Subcategory("subcategoryID2C", "Test Subcategory 2C", "categoryID3"),
		new Subcategory("subcategoryID3C", "Test Subcategory 3C", "categoryID3"),
		new Subcategory("subcategoryID4C", "Test Subcategory 4C", "categoryID3"),

		new Subcategory("subcategoryID1D", "Test Subcategory 1D", "categoryID4"),
		new Subcategory("subcategoryID2D", "Test Subcategory 2D", "categoryID4"),
		new Subcategory("subcategoryID3D", "Test Subcategory 3D", "categoryID4"),
		new Subcategory("subcategoryID4D", "Test Subcategory 4D", "categoryID4"),
	],
    // Total Cleared = 421.94
	clearedTransactions: [
		new Transaction("transactionID1", timestamp, "Payee1", "memo", false, 1500000000, true, "accountID1", "categoryID1", "subcategoryID1A"),
		new Transaction("transactionID2", timestamp2, "payee2", "memo", true, 1000000000, true, "accountID1", "categoryID1", "subcategoryID2A"),

		new Transaction("transactionID3", timestamp3, "payee3", "memo", true, 55670000, true, "accountID1", "categoryID2", "subcategoryID1B"),
		new Transaction("transactionID4", timestamp3, "payee4", "memo", true, 22390000, true, "accountID1", "categoryID2", "subcategoryID2B"),
	],
     // Total Uncleared = 781.75
	unclearedTransactions: [
		new Transaction("transactionID5", timestamp, "payee5", "memo", false, 1000000000, false, "accountID2", "categoryID3", "subcategoryID1C"),
		new Transaction("transactionID6", timestamp2, "payee6", "memo", true, 100000000, false, "accountID2", "categoryID3", "subcategoryID2C"),
		new Transaction("transactionID7", timestamp3, "payee7", "memo", true, 85760000, false, "accountID2", "categoryID4", "subcategoryID1D"),
		new Transaction("transactionID8", timestamp5, "payee8", "memo", true, 32490000, false, "accountID2", "categoryID4", "subcategoryID2D"),
	],
};
