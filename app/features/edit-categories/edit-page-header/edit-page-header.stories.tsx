import { Meta, StoryFn } from "@storybook/react";
import { EditPageHeader, EditPageHeaderPropsType } from "./edit-page-header";

export default {
    title: "EditPage/Header",
    component: EditPageHeader,
    parameters: {
      layout: "fullscreen",
    },
  } as Meta<typeof EditPageHeader>;
  
  const Template: StoryFn<EditPageHeaderPropsType> = (args: EditPageHeaderPropsType) => <EditPageHeader {...args}/>;
  
  export const Default = Template.bind({});

  Default.args = {
    handleCancelEdits: () => {alert("Canceling edits")},
    handleConfirmEdits: () => {alert("Confirming edits")},
    handleShowNewCategory: () => {alert("Showing New Category")}
  }