import { IconButton } from "@/features/ui";
import styles from "./create-account-subpage.module.scss";
import { ChangeEvent } from "react";

export type CreateAccountSubpagePropsType = {
	handleBackClick: () => void;
	createAccount: () => void;
};

export function CreateAccountSubpage(props: CreateAccountSubpagePropsType) {
	const { handleBackClick, createAccount } = props;

	const handleNewAccountNameBlur = (event: ChangeEvent<HTMLInputElement>) => {
		const newName = event.target.value;

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
	const handleCreateAccountClick = () => {
		createAccount();
	};

	const handleInitialBalanceOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		let newInitialBalance = event.target.value;

		// Removes non-number characters
		const nonCurrencyRegex = /[^0-9.]/g;
		newInitialBalance = newInitialBalance.replace(nonCurrencyRegex, "");

		// Removes decimal points after the first
		if (newInitialBalance.includes(".")) {
			const indexOfDecimalPoint = newInitialBalance.indexOf(".");
			const substringBeforeDecimal = newInitialBalance.substring(0, indexOfDecimalPoint);
			const substringAfterDecimal = newInitialBalance.substring(indexOfDecimalPoint + 1, newInitialBalance.length + 1);
			const substringAfterDecimalReplaced = substringAfterDecimal.replaceAll(".", "");
			newInitialBalance = substringBeforeDecimal + "." + substringAfterDecimalReplaced;
		}

		event.target.value = newInitialBalance;
	}

	return (
		<>
			<header className={styles.header}>
				<IconButton button={{onClick: handleBackClick}} src={"/icons/arrow-left-grey-100.svg"} altText={"Button to navigate back to Accounts Page"}/>
				<span>Create Account</span>
				<button className={styles.finish} onClick={handleCreateAccountClick}>
					Finish
				</button>
			</header>
			<main className={styles.main}>
				<label>Enter a name for the account</label>
				<input type="text" placeholder="Account name..." required onBlur={handleNewAccountNameBlur} onKeyDown={handleEnterKeyDown} />
				<label>Enter the starting balance for the account</label>
				<input type="text" placeholder="$0.00" required onBlur={handleNewAccountInitialBalanceBlur} onKeyDown={handleEnterKeyDown} onChange={handleInitialBalanceOnChange}/>
			</main>
		</>
	);
}
