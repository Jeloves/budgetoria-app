import "../reset.css";
import styles from "./index.module.scss";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/firebase/auth";

type LoginFormData = {
	email: string;
	password: string;
};

export default function LoginPage() {
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
		<>
			<h1>Log In</h1>
			<h2 style={{ display: "flex" }}>
				New to Budgetoria?&nbsp;<a className="signup">Sign up here!</a>
			</h2>
			<form onSubmit={handleSubmit}>
				<input className="login_credential" id="email" type="email" name="email" placeholder="Email address" required value={formData.email} onChange={handleInputChange} />
				<input className="login_credential" id="password" type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} />

				<div style={{ display: "flex" }}>
					<a className="forgot_password">Forgot password?</a>
				</div>
				<button className="login" type="submit">
					Log In
				</button>
			</form>
		</>
	);
}
