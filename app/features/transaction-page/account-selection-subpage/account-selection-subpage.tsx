import { Account } from "@/firebase/models";
import styles from "./account-selection-subpage.module.scss";

export type AccountSelectionSubpagePropsType = {
	selectedAccountID: string;
	accounts: Account[];
	handleBackClick: () => void;
	selectAccount: (selectedAccountID: string) => void;
};

export function AccountSelectionSubpage(props: AccountSelectionSubpagePropsType) {
	const { selectedAccountID, accounts, handleBackClick, selectAccount } = props;

	return (<>Hello</>);
}
