import { auth } from "@/firebase/auth";
import { firestore } from "@/firebase/firebase.config";
import { connectAuthEmulator } from "firebase/auth";
import firebase from "firebase/compat/app";
import { connectFirestoreEmulator } from "firebase/firestore";

describe("Budget Page", () => {
	let baseURL: string;

	before(() => {
		baseURL = Cypress.env("BASE_URL");
		cy.visit(baseURL);
	});


	it("passes", () => {
		//connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
    //connectAuthEmulator(auth, "http://127.0.0.1:9099");
	});
});
