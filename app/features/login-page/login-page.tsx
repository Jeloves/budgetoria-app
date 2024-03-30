"use client";
import "../../../pages/reset.css";
import styles from "./login-page.module.scss";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/firebase/auth";

type LoginFormData = {
	email: string;
	password: string;
};

export function LoginPage() {
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const router = useRouter();
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await signInUser(formData.email, formData.password);
			const destinationUrl = "/budget";
			router.push(destinationUrl);
		} catch (error) {
			console.error("Failed to sign in and navigate to budget-page:", error);
		}
	};

	return (
		<section className={styles.loginContainer}>
			<div className={styles.logoContainer}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img className={styles.logo} src="/icons/budgetoria-logo.svg" alt="Budgetoria logo" />
			</div>
			<div className={styles.socialSignIn}>
				<button>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/icons/google-logo.svg" alt="Button to sign in with Google" />
					Continue with Google
				</button>
				<button>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/icons/apple-logo.svg" alt="Button to sign in with Apple" />
					Continue with Apple
				</button>
			</div>

			<div className={styles.divider}>
				<hr />
				<span>or</span>
				<hr />
			</div>

			<form className={styles.nativeSignIn} onSubmit={handleSubmit}>
				<input className="login_credential" id="email" type="email" name="email" placeholder="Email address" required value={formData.email} onChange={handleInputChange} />
				<input className="login_credential" id="password" type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} />

				<div>
					<a className="forgot_password">Forgot password?</a>
					<a className="forgot_password">Sign up</a>
				</div>

				<button className="login" type="submit">
					Log In
				</button>
			</form>
		</section>
	);
}
