import { IconButton } from "@/features/ui";
import styles from "./create-account-subpage.module.scss";
import { ChangeEvent, useState } from "react";

export type CreateAccountSubpagePropsType = {
	handleBackClick: () => void;
	createAccount: () => void;
};

export function CreateAccountSubpage(props: CreateAccountSubpagePropsType) {
	const { handleBackClick, createAccount } = props;

	const [name, setName] = useState<string>("");
	const [initialBalance, setInitialBalance] = useState<number>(0);

	const handleNewAccountNameBlur = (event: ChangeEvent<HTMLInputElement>) => {
		const newName = event.target.value;

	};
	const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.currentTarget.blur();
		}
	};
	const handleCreateAccountClick = () => {
		createAccount();
	};

	const handleNameOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		let newName = event.target.value;
		setName(newName);
	}
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

		if (newInitialBalance === "") {
			event.target.value = "";
			setInitialBalance(0)
		} else {
			event.target.value = "$" + newInitialBalance;
			setInitialBalance(parseFloat(newInitialBalance) * 1000000);
		}
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
				<input type="text" placeholder="Account name..." required onChange={handleNameOnChange}/>
				<label>Enter the starting balance for the account</label>
				<input type="text" placeholder="$0.00" required onKeyDown={handleEnterKeyDown} onChange={handleInitialBalanceOnChange}/>
			</main>
		</>
	);
}
