import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DatePicker, DatePickerPropsType } from "./date-picker"

export default {
  title: "Header/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof DatePicker>;

const Template: StoryFn<DatePickerPropsType> = (args) => <DatePicker {...args}/>;

export const Default = Template.bind({});

Default.args = {
    monthAcronyms: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
}
