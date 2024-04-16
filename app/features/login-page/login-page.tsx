"use client";
import "../../../pages/reset.css";
import styles from "./login-page.module.scss";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInUser, createUser } from "@/firebase/auth";
import { createInitialBudget } from "@/firebase/initial-budget";

type LoginFormData = {
	email: string;
	password: string;
};

export function LoginPage() {
	const [renderKey, setRenderKey] = useState<0 | 1>(0);
	const [isUserLoggingIn, setIsUserLoggingIn] = useState<boolean>(true);
	const [userID, setUserID] = useState<string>("");
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

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isUserLoggingIn) {
			signInUser(formData.email, formData.password).then(
				() => {
					router.push("/budget");
				},
				(error: string) => {
					alert(error);
					setRenderKey(renderKey === 0 ? 1 : 0);
				}
			);
		} else {
			createUser(formData.email, formData.password).then(
				(userID) => {
					setUserID(userID as string);
				},
				(error: string) => {
					alert(error);
					setRenderKey(renderKey === 0 ? 1 : 0);
				}
			);
		}
	};

	// Clears form data after failed sign-in or failed sign-up.
	useEffect(() => {
		setFormData({
			email: "",
			password: "",
		});
	}, [renderKey]);

	// Creates initial budget data when a new user signs up, and navigates to budget-page.
	useEffect(() => {
		const initializeBudgetData = async () => {
			if (userID !== "") {
				await createInitialBudget(userID);
				router.push("/budget");
			}
		};
		initializeBudgetData();
	}, [router, userID]);

	const socialLoginElement = (
		<>
			<div className={styles.socialSignIn}>
				<button data-test-id="google-signin-button">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/icons/google-logo.svg" alt="Button to sign in with Google" />
					Continue with Google
				</button>
				<button data-test-id="apple-signin-button">
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
		</>
	);

	const signupHeaderElement = (
		<>
			<h1 className={styles.signupHeader}>Sign Up with Budgetoria</h1>
			<div className={styles.divider}>
				<hr />
			</div>
		</>
	);

	return (
		<section key={renderKey} className={styles.loginContainer}>
			<div data-test-id="logo-container" className={styles.logoContainer}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src="/icons/budgetoria-logo.svg" alt="Budgetoria logo" />
			</div>

			{isUserLoggingIn ? socialLoginElement : signupHeaderElement}

			<form className={styles.nativeSignIn} onSubmit={handleFormSubmit}>
				<input data-test-id="input-email" id="email" type="email" name="email" placeholder="Email address" required value={formData.email} onChange={handleInputChange} />
				<input data-test-id="input-password" id="password" type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} />

				{isUserLoggingIn ? (
					<div>
						<a data-test-id="forgot-password-button">Forgot password?</a>
						<a
							data-test-id="signup-button"
							onClick={() => {
								setIsUserLoggingIn(false);
							}}
						>
							Sign up
						</a>
					</div>
				) : (
					<div>
						<a
							data-test-id="existing-user-button"
							onClick={() => {
								setIsUserLoggingIn(true);
							}}
						>
							Existing user?
						</a>
					</div>
				)}

				<button data-test-id="submit-button" className={isUserLoggingIn ? "" : styles.signupConfirm} type="submit">
					{isUserLoggingIn ? "Log In" : "Sign Up"}
				</button>
			</form>
		</section>
	);
}
