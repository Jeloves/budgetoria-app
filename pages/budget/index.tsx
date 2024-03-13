"use client";
import "@/styles/global.scss";
import { useEffect, useState } from "react";
import { auth, getUser } from "@/firebase/auth";
import { User } from "firebase/auth/cordova";

export default function BudgetPage() {
	const [user, setUser] = useState<User | null>(null);

	// Sets user
	useEffect(() => {
		auth.onAuthStateChanged((user: User | null) => {
			setUser(user);
		});
	});

	// Sets budgets
	useEffect(() => {
		const fetchBudgetData = async () => {};
		fetchBudgetData();
	}, [user]);

	return (
		<>
			<header></header>
			<main></main>
		</>
	);
}
