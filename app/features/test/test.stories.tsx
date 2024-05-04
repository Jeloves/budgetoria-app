import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Test, TestPropsType } from "./test";

export default {
	title: "Test",
	component: Test,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof Test>;

const Template: StoryFn<TestPropsType> = (args) => <Test {...args} />;

export const Default = Template.bind({});

Default.args = {
};
