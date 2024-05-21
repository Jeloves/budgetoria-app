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


	it("visits the webpage", () => {
		
	});
});

