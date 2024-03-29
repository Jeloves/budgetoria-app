"use client";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { getUser } from "@/firebase/auth";

export default function Home() {
	const router = useRouter();
	if (getUser()) {
		router.push("/budget");
	} else {
    router.push("/login")
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
