import { Account } from "@/firebase/models";
import styles from "./account-selection-subpage.module.scss";
import { IconButton } from "@/features/ui";

export type AccountSelectionSubpagePropsType = {
	selectedAccountID: string;
	accounts: Account[];
	handleBackClick: () => void;
	selectAccount: (selectedAccountID: string) => void;
};

export function AccountSelectionSubpage(props: AccountSelectionSubpagePropsType) {
	const { selectedAccountID, accounts, handleBackClick, selectAccount } = props;

	const accountElements: JSX.Element[] = [];
	let totalBalance = 0;
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		totalBalance += account.balance;

		// Checks for and styles the selected account
		const isSelected = selectedAccountID === account.id;
		let spanClass = "";
		if (account.balance < 0) {
			spanClass = styles.negative;
		} else if (account.balance > 0) {
			spanClass = styles.positive;
		}

		// Creates account element
		accountElements.push(
			<div
				key={`account${i}`}
				className={styles.account}
				onClick={() => {
					selectAccount(account.id);
				}}
			>
				<div className={styles.selected}>
					{/* eslint-disable @next/next/no-img-element */}
					<img className={isSelected ? styles.icon : ""} src="/icons/checkmark.svg" alt="Selected account icon" />
				</div>
				{account.name}
				<span className={spanClass}>${(account.balance / 1000000).toFixed(2)}</span>
			</div>
		);

        // Adds a border between accounts
        if (accounts.length > 1 && i < accounts.length - 1) {
            accountElements.push(<hr key={`border${i}`} className={styles.border} />);
        }
	}

	return (
		<>
			<header className={styles.header}>
				<IconButton
					button={{
						onClick: handleBackClick,
					}}
					src={"/icons/arrow-left.svg"}
					altText={"Return to transaction page button"}
				/>
				<span>Select Account</span>
			</header>
			<main className={styles.main}>
				<div key={"total"} className={styles.total}>
					Budget
					<span>${(totalBalance / 1000000).toFixed(2)}</span>
				</div>
				<div className={styles.accountsContainer}>{accountElements}</div>
			</main>
		</>
	);
}
