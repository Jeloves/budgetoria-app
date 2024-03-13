import { useState } from "react";
import Image from "next/image";
import styles from "./topbar.module.scss";
import { IconButton } from "@/features/ui/icon-button/icon-button";

const monthAcronyms = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Topbar() {
	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());

	const dateDisplay = (
		<div className={styles.dateDisplay}>
			<span>Mar 2024</span>
			<IconButton src="/icons/arrow-down.svg" altText="Button to open Date Picker" />
		</div>
	);

	return (
		<section className={styles.topbarContainer}>
			<IconButton src="/icons/ellipsis.svg" altText="Button to open Side Navigation" />
			{dateDisplay}
			<IconButton src="/icons/edit.svg" altText="Button to edit categories" />
			<IconButton src="/icons/circled-dollar.svg" altText="Button to create new transaction" />
		</section>
	);
}
