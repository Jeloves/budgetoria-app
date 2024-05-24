import { IconButton } from "@/features/ui";
import styles from "./create-account-subpage.module.scss";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Account } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";

export type CreateAccountSubpagePropsType = {
	handleBackClick: () => void;
	handleCreateAccount: (newAccount: Account) => void;
};

export function CreateAccountSubpage(props: CreateAccountSubpagePropsType) {
	const { handleBackClick, handleCreateAccount } = props;

	const [name, setName] = useState<string>("");
	const [initialBalance, setInitialBalance] = useState<number>(0);
	const [outflow, setOutflow] = useState<boolean>(false);

	const handleNameOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		let newName = event.target.value;
		setName(newName);
	};
	const handleSwitchToOutflow = () => {
		setOutflow(true);
	}
	const handleSwitchToInflow = () => {
		setOutflow(false);
	}
	const handleInitialBalanceOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		let newInitialBalance = event.target.value;

		// Removes non-number characters
		const nonCurrencyRegex = /[^0-9.-]/g;
		newInitialBalance = newInitialBalance.replace(nonCurrencyRegex, "");

		// Removes decimal points after the first
		if (newInitialBalance.includes(".")) {
			const indexOfDecimalPoint = newInitialBalance.indexOf(".");
			const substringBeforeDecimal = newInitialBalance.substring(0, indexOfDecimalPoint);
			const substringAfterDecimal = newInitialBalance.substring(indexOfDecimalPoint + 1, newInitialBalance.length + 1);
			let substringAfterDecimalReplaced = substringAfterDecimal.replaceAll(".", "");
			// Removes any number after the hundredths place
			if (substringAfterDecimalReplaced.length > 2) {
				substringAfterDecimalReplaced = substringAfterDecimalReplaced.substring(0, 2);
			}
			newInitialBalance = substringBeforeDecimal + "." + substringAfterDecimalReplaced;
		}

		// Removes any number after the hundredths place
		const charsAfterDecimal = newInitialBalance.slice()

		if (newInitialBalance === "") {
			event.target.value = "";
			setInitialBalance(0);
		} else {
			event.target.value = "$" + newInitialBalance;
			setInitialBalance(parseFloat(newInitialBalance) * 1000000);
		}
	};
	const handleCreateAccountClick = () => {
		if (name === "") {
			alert("Must enter a name for the new account.");
		} else {
			const newAccount = new Account(uuidv4(), name, Timestamp.fromDate(new Date()), initialBalance, initialBalance);
			if (outflow) {
				newAccount.initialBalance *= -1;
				newAccount.balance *= -1;
			} 
			handleCreateAccount(newAccount);
		}
	};

	return (
		<>
			<header className={styles.header}>
				<IconButton button={{ onClick: handleBackClick }} src={"/icons/arrow-left-grey-100.svg"} altText={"Button to navigate back to Accounts Page"} />
				<span>Create Account</span>
				<button className={styles.finish} onClick={handleCreateAccountClick}>
					Finish
				</button>
			</header>
			<main className={styles.main}>
				<label>Enter a name for the account</label>
				<input type="text" placeholder="Account name..." required onChange={handleNameOnChange} />
				<label>Enter the starting balance for the account</label>
				<div className={styles.balance}>
					<div className={styles.flowContainer}>
						<div className={outflow ? styles.outflow : ""}>
							<IconButton button={{ onClick: handleSwitchToOutflow }} src={outflow ? "/icons/minus-gray-100.svg" : "/icons/minus-gray-500.svg"} altText={"Button to make a negative balance"} />
						</div>
						<hr className={styles.border}/>
						<div className={outflow ? "" : styles.inflow}>
							<IconButton button={{ onClick: handleSwitchToInflow}} src={outflow ? "/icons/plus-gray-500.svg" : "/icons/plus-gray-100.svg"} altText={"Button to make a positive balance"} />
						</div>
					</div>
					<input type="text" placeholder="$0.00" required onChange={handleInitialBalanceOnChange} />
				</div>
			</main>
		</>
	);
}
