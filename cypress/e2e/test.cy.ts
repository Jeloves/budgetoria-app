import { clearEmulators } from "cypress/support/firebase";
import { v4 as uuidv4 } from "uuid";

describe("Firestore Emulator Tests", () => {
	const baseURL = Cypress.env("BASE_URL");
	const email = uuidv4() + "@email.com";
	const password = uuidv4();

	after(() => {});

	context("Sign up", () => {
		before(() => {
			cy.visit("http://localhost:3000");
		});

		it("Signs up a new user", () => {
			cy.get('[data-test-id="signup-button"]').click();
			cy.get("[data-test-id='input-email']").type(email);
			cy.get("[data-test-id='input-password']").type(password);
			cy.get("[data-test-id='submit-button']").click();
			cy.get("header").should("exist");
			cy.get("main").should("exist");
		});
	});

	context("New user data", () => {
		beforeEach(() => {
			cy.visit("http://localhost:3000/budget");
		});

		const expectedCategories = ["Essential", "Nonessential"];
		const expectedSubcategories = ["Electricity", "Gas", "Crunchyroll", "Videogames"];

		it("shows current date", () => {
			const expectedString = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());

			cy.get('[data-test-id="topbar"] span').should("have.text", expectedString);
		});

		it("shows correct categories, subcategories, and allocations", () => {
			for (let i = 0; i < expectedCategories.length; i++) {
				cy.get('[data-test-id="category-item"]')
					.eq(i)
					.within(() => {
						cy.get("span").eq(0).should("have.text", expectedCategories[i]);
						cy.get("div").eq(0).should("have.text", "Assigned$0.00");
						cy.get("div").eq(1).should("have.text", "Available$0.00");
					});
			}

			for (let i = 0; i < expectedSubcategories.length; i++) {
				cy.get('[data-test-id="subcategory-item"]')
					.eq(i)
					.within(() => {
						cy.get("span").eq(0).should("have.text", expectedSubcategories[i]);
						cy.get("input").should("have.value", "$0.00");
						cy.get("span").eq(1).should("have.text", "$0.00");
					});
			}
		});

		it("shows correct categories and subcategories within Edit Page", () => {
			cy.get('[data-test-id="topbar"] button').eq(2).click();

			for (let i = 0; i < expectedCategories.length; i++) {
				cy.get('[data-test-id="edit-category-item"]')
					.eq(i)
					.within(() => {
						cy.get("input").should("have.value", expectedCategories[i]);
					});
			}

			for (let i = 0; i < expectedSubcategories.length; i++) {
				cy.get('[data-test-id="edit-subcategory-item"]')
					.eq(i)
					.within(() => {
						cy.get("input").should("have.value", expectedSubcategories[i]);
					});
			}
		});

		it("shows $0.00 as the unassigned balance", () => {
			cy.get('[data-test-id="unassigned-balance"] data').should("have.text", "$0.00");
		});

		it("contains no accounts", () => {
			cy.get('[data-test-id="navigation-bar"] button').eq(2).click();
			cy.get('[data-test-id="total-item"] span').eq(1).should("have.text", "$0.00");
			cy.get('[data-test-id="account-item-0"]').should("not.exist");
		});
	});
});
