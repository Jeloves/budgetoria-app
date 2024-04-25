import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DateSelectionSubpage, DateSelectionSubpagePropsType } from "./date-selection-subpage";
import { Timestamp } from "firebase/firestore";
import { getDateStringFromTimestamp } from "@/utils/date";

export default {
	title: "Transaction/DateSelectionSubpage",
	component: DateSelectionSubpage,
	parameters: {
		layout: "fullscreen",
	},
} as Meta<typeof DateSelectionSubpage>;

const Template: StoryFn<DateSelectionSubpagePropsType> = (args) => <DateSelectionSubpage {...args} />;

export const Default = Template.bind({});

const date = new Date(2024, 0, 30);
const timestamp = Timestamp.fromDate(date);
Default.args = {
	timestamp: timestamp,
	handleBackClick: () => {
		alert("Back click");
	},
	selectNewDate: (newDate: Date) => {
		console.log("Selected Date", newDate);
		console.log("Written as", getDateStringFromTimestamp(Timestamp.fromDate(newDate)));
	},
};
