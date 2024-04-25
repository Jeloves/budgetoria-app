import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { AccountSelectionSubpage, AccountSelectionSubpagePropsType } from "./account-selection-subpage";
import { v4 as uuidv4 } from "uuid";


export default {
	title: "Transaction/AccountSelectionSubpage",
	component: AccountSelectionSubpage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof AccountSelectionSubpage>;

const Template: StoryFn<AccountSelectionSubpagePropsType> = (args) => <AccountSelectionSubpage {...args} />;

export const Default = Template.bind({});

Default.args = {
};
