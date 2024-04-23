import classNames from "classnames";
import styles from "./accounts-page.module.scss";
import { Account } from "@/firebase/models";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton } from "../ui";

export type AccountsPagePropsType = {
	accounts: Account[];
	handleConfirmNewAccount: (newAccount: Account) => void;
};

type NewAccountData = {
	name: string;
	initialBalance: number;
};

export function AccountsPage(props: AccountsPagePropsType) {
	const { accounts, handleConfirmNewAccount } = props;
	const [newAccountData, setNewAccountData] = useState<NewAccountData>({ name: "", initialBalance: 0 });
	const [accountsPageRenderKey, setAccountsPageRenderKey] = useState<0 | 1>(0);
	const [initialBalanceRenderKey, setInitialBalanceRenderKey] = useState<0 | 1>(0);

	const viewTransactionsClick = () => {
		alert("viewing transactions");
	};

	const handleNewAccountNameBlur = (event: ChangeEvent<HTMLInputElement>) => {
		const newName = event.target.value;
		const currentInitialBalance = newAccountData.initialBalance;
		setNewAccountData({ name: newName, initialBalance: currentInitialBalance });
	};
	const handleNewAccountInitialBalanceBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		let newInitialBalance = event.target.value;
		// Removes currency string if present
		if (newInitialBalance.includes("$")) {
			newInitialBalance = newInitialBalance.replace("$", "");
		}
		// Removes non-number characters
		const nonCurrencyRegex = /[^0-9.]/g;
		newInitialBalance = newInitialBalance.replace(nonCurrencyRegex, "");
		const isValidNumber = !isNaN(parseFloat(newInitialBalance));

		const currentName = newAccountData.name;
		if (isValidNumber) {
			setNewAccountData({ name: currentName, initialBalance: parseFloat(newInitialBalance) * 1000000 });
		} else {
			setNewAccountData({ name: currentName, initialBalance: 0 });
		}
		setInitialBalanceRenderKey(initialBalanceRenderKey === 0 ? 1 : 0);
	};
	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.currentTarget.blur();
		}
	};
	const handleShowAddAccountElement = () => {
		const element = document.getElementById("add_account_element_id");
		if (element) {
			element!.classList.remove(styles.hideAddAccount);
			element!.classList.add(styles.displayAddAccount);
		}
	};
	const handleHideAddAccountElement = () => {
		const element = document.getElementById("add_account_element_id");
		if (element) {
			element!.classList.remove(styles.displayAddAccount);
			element!.classList.add(styles.hideAddAccount);
			setNewAccountData({ name: "", initialBalance: 0 });
		}
	};
	const handleVerifyNewAccount = () => {
		if (newAccountData.name === "") {
			alert("The new account must have a name.");
		} else {
			const newAccount = new Account(uuidv4(), newAccountData.name, newAccountData.initialBalance, newAccountData.initialBalance);
			handleConfirmNewAccount(newAccount);
			handleHideAddAccountElement();
			accounts.push(newAccount);
			setAccountsPageRenderKey(accountsPageRenderKey === 0 ? 1 : 0);
		}
	};

	const accountItems: JSX.Element[] = [];
	let totalAccountBalance = 0;
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		totalAccountBalance += account.balance;
		accountItems.push(
			<div key={`account_item_${i}`} className={styles.accountItem}>
				<span key={`account_item_name_${i}`}>{account.name}</span>
				<span key={`account_item_balance_${i}`}>${(account.balance / 1000000).toFixed(2)}</span>
			</div>
		);
	}
	accountItems.unshift(
		<div key={"total_item_0"} className={classNames(styles.accountItem, styles.totalItem)}>
			<span key={"total_item_name_0"}>Budget</span>
			<span key={"total_item_balance_0"}>${(totalAccountBalance / 1000000).toFixed(2)}</span>
		</div>
	);

	const addAccountElement = (
		<section id="add_account_element_id" className={styles.addAccount}>
			<header>
				<button className={styles.cancel} onClick={handleHideAddAccountElement}>
					Cancel
				</button>
				<span>Add Account</span>
				<button className={styles.done} onClick={handleVerifyNewAccount}>
					Done
				</button>
			</header>
			<div>
				<label>Enter a name for the account:</label>
				<input type="text" placeholder="Account name..." required defaultValue={newAccountData.name} onBlur={handleNewAccountNameBlur} onKeyDown={handleEnterKeyDown} />
				<label>Enter the starting balance for the account:</label>
				<input key={initialBalanceRenderKey} type="text" placeholder="$0.00" required defaultValue={"$" + (newAccountData.initialBalance / 1000000).toFixed(2)} onBlur={handleNewAccountInitialBalanceBlur} onKeyDown={handleEnterKeyDown} />
			</div>
		</section>
	);

	return (
		<>
			<header className={styles.header}>Accounts</header>
			<main key={accountsPageRenderKey} className={styles.main}>
				{addAccountElement}
				{accountItems}
				<div className={styles.accountButtons}>
					<button onClick={handleShowAddAccountElement}>
						Add Accounts
						{/*eslint-disable-next-line @next/next/no-img-element*/}
						<img src="/icons/arrow-right.svg" alt="Button to add accounts" />
					</button>
					<button>
						Closed Accounts
						{/*eslint-disable-next-line @next/next/no-img-element*/}
						<img src="/icons/arrow-right.svg" alt="Button to show closed accounts" />
					</button>
				</div>
			</main>
		</>
	);
}
