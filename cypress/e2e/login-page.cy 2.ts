import { v4 as uuidv4 } from "uuid";
import { deleteCurrentUser } from "@/firebase/auth";

describe("Login Page", () => {
	beforeEach(() => {
		cy.visit("localhost:3000");
	});

	it("navigates between sign-in and sign-up page", () => {
		cy.get('[data-test-id="signup-button"]').click();
		cy.get("h1").should("be.visible");
		cy.get('[data-test-id="existing-user-button"]').should("be.visible");
		cy.get('[data-test-id="existing-user-button"]').click();
		cy.get('[data-test-id="forgot-password-button"]').should("be.visible");
		cy.get("[data-test-id='google-signin-button'] > img").should("be.visible");
		cy.get("[data-test-id='apple-signin-button'] > img").should("be.visible");
	});

	context("Sign In", () => {
		it("renders correct text and images", () => {
			cy.get("[data-test-id='logo-container'] > img").should("be.visible").invoke("attr", "src").should("contain", "/icons/budgetoria-logo.svg");
			cy.get("[data-test-id='google-signin-button'] > img").should("be.visible").invoke("attr", "src").should("contain", "/icons/google-logo.svg");
			cy.get("[data-test-id='apple-signin-button'] > img").should("be.visible").invoke("attr", "src").should("contain", "/icons/apple-logo.svg");
			cy.get("[data-test-id='google-signin-button']").should("be.visible").contains("Continue with Google");
			cy.get("[data-test-id='apple-signin-button']").should("be.visible").contains("Continue with Apple");
			cy.get('[data-test-id="forgot-password-button"]').should("be.visible").contains("Forgot password");
			cy.get('[data-test-id="signup-button"]').should("be.visible").contains("Sign up");
			cy.get('[data-test-id="submit-button"]').should("be.visible").contains("Log In");
		});

		it("signs in a user", () => {
			let email = "";
			let password = "";
			cy.fixture("user-credentials")
				.then((credentials) => {
					email = credentials.env.email;
					password = credentials.env.password;
				})
				.then(() => {
					cy.get("[data-test-id='input-email']").type(email);
					cy.get("[data-test-id='input-password']").type(password);
					cy.get("[data-test-id='submit-button']").click();
				});
		});
	});

	context("Sign Up", () => {
		
	})

	/*
	context("sign up new user", () => {
		it("shows signup link", () => {
			cy.get('[data-test-id="signup-button"]').should("be.visible").contains("Sign up");
		});

		it("signs up a new user", () => {
			const testEmail = `${uuidv4()}@email.com`;
			const testPassword = uuidv4();
			cy.get('[data-test-id="signup-button"]').click();
			cy.get("[data-test-id='input-email']").type(testEmail);
			cy.get("[data-test-id='input-password']").type(testPassword);
		});
	});
	*/
});
