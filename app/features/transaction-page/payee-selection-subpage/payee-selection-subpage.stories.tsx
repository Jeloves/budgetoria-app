import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { PayeeSelectionSubpage, PayeeSelectionSubpagePropsType } from "./payee-selection-subpage";

export default {
  title: "Transaction/PayeeSelectionSubpage",
  component: PayeeSelectionSubpage,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PayeeSelectionSubpage>;

const Template: StoryFn<PayeeSelectionSubpagePropsType> = (args) => <PayeeSelectionSubpage {...args}/>;

export const Default = Template.bind({});

Default.args = {
    selectedPayee: "146",
    payees: ["Crunchyroll", "Royal Farms", "Steam", "Amazon", "Spotify", "Dave's Hot Chicken", "Ebay", "FAFSA", "Weis Market", "Netflix", "%%", "%Hello", "!figure", "!rr", "123", "146", "12", "600012308", "6", "6Hello", "6figures"],
}
