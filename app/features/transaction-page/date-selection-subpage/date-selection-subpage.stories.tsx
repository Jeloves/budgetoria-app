import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DateSelectionSubpage, DateSelectionSubpagePropsType } from "./date-selection-subpage";
import { Timestamp } from "firebase/firestore";

export default {
  title: "Transaction/DateSelectionSubpage",
  component: DateSelectionSubpage,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof DateSelectionSubpage>;

const Template: StoryFn<DateSelectionSubpagePropsType> = (args) => <DateSelectionSubpage {...args}/>;

export const Default = Template.bind({});

const date = new Date(1978, 9, 14)
const timestamp = Timestamp.fromDate(date);
Default.args = {
    timestamp: timestamp,
}
