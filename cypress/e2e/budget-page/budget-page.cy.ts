import { auth } from "@/firebase/auth";
import { firestore } from "@/firebase/firebase.config";
import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";

describe("Budget Page", () => {
	let baseURL: string;

	before(() => {
		baseURL = Cypress.env("BASE_URL");
		connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
		cy.visit(baseURL);
	});

	it("logs in and changes something", () => {


		cy.get('[data-test-id="signup-button"]').click();

		cy.get("[data-test-id='input-email']").type("testemail@email.com");
		cy.get("[data-test-id='input-password']").type("testpassword1234")
		cy.get("[data-test-id='submit-button']").click();

		cy.get("[data-test-id='subcategory_item_Gas']").should('have.text', "Gas")
		cy.wait(5000);

	});

});
