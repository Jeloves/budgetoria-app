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

const monthAcronyms = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

Default.args = {
    monthAcronyms: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    handlePreviousYearOnClick: () => {
        console.log("prev year")
    },
    handleNextYearOnClick: () => {
        console.log("next year")
    },
    handleMonthOnClick: (index) => {
        console.log(monthAcronyms[index])
    }
}
