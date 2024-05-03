import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CreateAccountSubpage, CreateAccountSubpagePropsType } from "./create-account-subpage";
import { Account } from "@/firebase/models";

export default {
	title: "AccountsPage/CreateAccountSubpage",
	component: CreateAccountSubpage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof CreateAccountSubpage>;

const Template: StoryFn<CreateAccountSubpagePropsType> = (args) => <CreateAccountSubpage {...args} />;

export const Default = Template.bind({});

Default.args = {
};
