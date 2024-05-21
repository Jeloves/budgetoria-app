import styles from "./page.module.scss";
import { LoginPage } from "./features/login-page";

export default function Home() {
	return (
		<main className={styles.main}>
			<LoginPage/>
		</main>
	);
}
