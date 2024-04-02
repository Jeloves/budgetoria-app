import { IconButton } from "../ui";
import styles from "./accounts-header.module.scss";

export type AccountsHeaderPropsType = {
    navigateToBudgetPage: () => void;
}

export function AccountsHeader(props: AccountsHeaderPropsType) {
    const { navigateToBudgetPage } = props;
    return (
        <section className={styles.accountsHeader}>
            <IconButton button={{onClick: navigateToBudgetPage}} src={"/icons/arrow-left.svg"} altText={"Button to navigate back to Budget Page"}/>
            Accounts
            <div className={styles.empty}/>
        </section>
    )
}