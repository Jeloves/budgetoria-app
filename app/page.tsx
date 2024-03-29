import styles from "./page.module.scss";
import { redirect } from "next/navigation";
import { getUser } from "@/firebase/auth";

export default function Home() {
  
	if (getUser()) {
		redirect("/budget");
	} else {
		redirect("/login");
	}

	return (
		<main className={styles.main}>
			<div>
				<span>Budgetoria</span>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src="/icons/loading.svg" alt="Loading icon" />
			</div>
		</main>
	);
}
