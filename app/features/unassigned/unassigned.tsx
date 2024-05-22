import { useEffect, useState } from "react";
import styles from "./unassigned.module.scss";
import { getUnassignedBalance } from "@/firebase/budgets";
import { formatCurrency } from "@/utils/currency";

type UnassignedPropsType = {
	userID: string;
	budgetID: string;
};

export function Unassigned(props: UnassignedPropsType) {
	const { userID, budgetID } = props;

	const [unassignedBalance, setUnassignedBalance] = useState<number>(0);
	useEffect(() => {
		const fetch = async () => {
			const unassigned = await getUnassignedBalance(userID, budgetID);
			setUnassignedBalance(unassigned);
		};
		fetch();
	});
	return (
		<>
			<section data-test-id="unassigned-balance" className={styles.unassigned}>
				<div>
					<data>{formatCurrency(unassignedBalance)}</data>
					<label>Ready to Assign</label>
				</div>
			</section>
		</>
	);
}

export default Unassigned;
