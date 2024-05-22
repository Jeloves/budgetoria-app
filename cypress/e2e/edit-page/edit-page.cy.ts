import { getSubcategories } from "@/firebase/categories";
import { v4 as uuidv4 } from "uuid";

describe("Editing Categories Test", () => {
	const url = Cypress.env("LOCAL_URL");
	const email = uuidv4() + "@email.com";
	const password = uuidv4();

	it("Signs up a mock user", () => {
		cy.visit(url);
		cy.get('[data-test-id="signup-button"]').click();
		cy.get("[data-test-id='input-email']").type(email);
		cy.get("[data-test-id='input-password']").type(password);
		cy.get("[data-test-id='submit-button']").click();
		cy.get("header").should("exist");
		cy.get("main").should("exist");
	});

	context("Deleting categories and subcategories", () => {
		beforeEach(() => {
			cy.visit(url + "/budget");
			cy.get('[data-test-id="topbar"] button').eq(2).click();
		});

		it("Deletes individual subcategories", () => {
			const initialSubcategories = ["Electricity", "Gas", "Crunchyroll", "Videogames"];

			// Deletes first subcategory (Electricity)
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(0)
				.within(() => {
					cy.get("button").eq(0).click();
				});

			for (let i = 0; i < 4; i++) {
				if (i < 3) {
					cy.get('[data-test-id="edit-subcategory-item"]')
						.eq(i)
						.within(() => {
							cy.get("input").should("have.value", initialSubcategories[i + 1]);
						});
				} else {
					cy.get('[data-test-id="edit-subcategory-item"]').eq(i).should("not.exist");
				}
			}

			// Deletes last subcategory (Videogames)
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(2)
				.within(() => {
					cy.get("button").eq(0).click();
				});

			for (let i = 0; i < 4; i++) {
				if (i < 2) {
					cy.get('[data-test-id="edit-subcategory-item"]')
						.eq(i)
						.within(() => {
							cy.get("input").should("have.value", initialSubcategories[i + 1]);
						});
				} else {
					cy.get('[data-test-id="edit-subcategory-item"]').eq(i).should("not.exist");
				}
			}

			// Categories should be unaffected
			cy.get('[data-test-id="edit-category-item"]').eq(0).should("exist");
			cy.get('[data-test-id="edit-category-item"]').eq(1).should("exist");

			// Returns to budget-page
			cy.get("header button").eq(1).click();

			// Checks the budget page is updated (thus, firebase is updated)
			for (let i = 0; i < 4; i++) {
				if (i < 2) {
					cy.get('[data-test-id="subcategory-item"]')
						.eq(i)
						.within(() => {
							cy.get("span")
								.eq(0)
								.should("have.text", initialSubcategories[i + 1]);
						});
				} else {
					cy.get('[data-test-id="subcategory-item"]').eq(i).should("not.exist");
				}
			}
			cy.get('[data-test-id="category-item"]').eq(0).should("exist");
			cy.get('[data-test-id="category-item"]').eq(1).should("exist");
		});

		it("Deletes categories with nested subcategories", () => {
			const initialCategories = ["Essential", "Nonessential"];
			const initialSubcategories = ["Gas", "Crunchyroll"];

			// Deleting first category
			cy.get('[data-test-id="edit-category-item"')
				.eq(0)
				.within(() => {
					cy.get("button").eq(0).click();
				});

			cy.get('[data-test-id="edit-category-item"')
				.eq(0)
				.within(() => {
					cy.get("input").should("have.value", initialCategories[1]);
				});
			cy.get('[data-test-id="edit-subcategory-item"')
				.eq(0)
				.within(() => {
					cy.get("input").should("have.value", initialSubcategories[1]);
				});

			cy.get('[data-test-id="edit-category-item"').eq(1).should("not.exist");
			cy.get('[data-test-id="edit-subcategory-item"').eq(1).should("not.exist");

			// Deleting final category
			cy.get('[data-test-id="edit-category-item"')
				.eq(0)
				.within(() => {
					cy.get("button").eq(0).click();
				});

			cy.get('[data-test-id="edit-category-item"').should("not.exist");
			cy.get('[data-test-id="edit-subcategory-item"').should("not.exist");

			// Returns to budget-page
			cy.get("header button").eq(1).click();

			// Checks the budget page is updated (thus, firebase is updated)
            cy.get('[data-test-id="category-item"').should("not.exist");
            cy.get('[data-test-id="subcategory-item"').should("not.exist");
		});
	});
});
