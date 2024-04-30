import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountSelectionSubpage, AccountSelectionSubpagePropsType } from "./account-selection-subpage";
import { v4 as uuidv4 } from "uuid";
import { Account } from "@/firebase/models";
import { getAccountNameByID } from "@/utils/getByID";
import { Timestamp } from "firebase/firestore";


export default {
	title: "Transaction/AccountSelectionSubpage",
	component: AccountSelectionSubpage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof AccountSelectionSubpage>;

const Template: StoryFn<AccountSelectionSubpagePropsType> = (args) => <AccountSelectionSubpage {...args} />;

export const Default = Template.bind({});

const account1 = new Account(uuidv4(), "Checkings", Timestamp.fromDate(new Date(2024, 0, 1)), 2000000000, 1800000000);
const account2 = new Account(uuidv4(), "Credit", Timestamp.fromDate(new Date(2024, 0, 1)), 0, -10000000);
const account3 = new Account(uuidv4(), "Savings", Timestamp.fromDate(new Date(2024, 0, 1)), 347880000, 347880000);
const accounts = [account1, account2, account3];

Default.args = {
    selectedAccountID: account1.id,
    accounts: accounts,
    handleBackClick: () => {alert("Back to transaction page")},
    selectAccount: (selectedAccountID: string) => {
        alert(`Selected account: ${getAccountNameByID(selectedAccountID, accounts)}`);
    }
};
