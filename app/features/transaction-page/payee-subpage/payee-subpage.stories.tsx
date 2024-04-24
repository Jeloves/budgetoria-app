import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { PayeeSubpage, PayeeSubpagePropsType } from "./payee-subpage";

export default {
  title: "Transaction/PayeeSubpage",
  component: PayeeSubpage,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PayeeSubpage>;

const Template: StoryFn<PayeeSubpagePropsType> = (args) => <PayeeSubpage {...args}/>;

export const Default = Template.bind({});

Default.args = {
    selectedPayee: "146",
    payees: ["Crunchyroll", "Royal Farms", "Steam", "Amazon", "Spotify", "Dave's Hot Chicken", "Ebay", "FAFSA", "Weis Market", "Netflix", "%%", "%Hello", "!figure", "!rr", "123", "146", "12", "600012308", "6", "6Hello", "6figures"],
}
