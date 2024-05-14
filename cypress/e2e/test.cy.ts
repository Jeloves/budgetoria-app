import { createUser } from "@/firebase/auth";
import { createBudget } from "@/firebase/budgets";
import { firestore } from "@/firebase/firebase.config";
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { connectFirestoreEmulator } from "firebase/firestore";

describe("Firestore Emulator Tests", () => {
	let baseURL: string;

	before(() => {
		baseURL = Cypress.env("BASE_URL");
		cy.visit(baseURL);
	});

	beforeEach(() => {});

	it("visits the webpage", () => {
		firebase.apps.forEach((app) => app.delete());
		const firebaseConfig = {
			apiKey: "AIzaSyBh1M-BQ6HN_PPgBVQuDkZJ8-2aTmK0irU",
			authDomain: "http://127.0.0.1:9000/auth",
			projectId: "budgetoria",
			storageBucket: "budgetoria.appspot.com",
			messagingSenderId: "713558167556",
			appId: "1:713558167556:web:99f9ce1aacea51e4502551",
			measurementId: "G-QG4KE52G5H",
		};

		firebase.initializeApp(firebaseConfig);
		const newAuth = getAuth();

		cy.wrap(connectAuthEmulator(newAuth, "http://127.0.0.1:9099/auth")).then(() => {
			let email = "testemail1@email.com";
			let password = "testpassword1";
			cy.get('[data-test-id="signup-button"]').click();
			cy.get("[data-test-id='input-email']").type(email);
			cy.get("[data-test-id='input-password']").type(password);
			cy.get("[data-test-id='submit-button']").click();

      createUserWithEmailAndPassword(newAuth, email, password);
		});
	});
});
