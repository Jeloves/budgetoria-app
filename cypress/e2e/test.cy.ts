import { clearEmulators } from "cypress/support/firebase";


describe("Firestore Emulator Tests", () => {
	let baseURL: string;

	before(() => {
		baseURL = Cypress.env("BASE_URL");
		cy.visit(baseURL);
	});

	after(() => {
		clearEmulators();
	});

	it("visits the webpage", () => {});
});
