import { getSubcategories } from "@/firebase/categories";
import { getMockData } from "../../support/mock";
import { v4 as uuidv4 } from "uuid";
import { Subcategory } from "@/firebase/models";

describe("Editing Categories Test", () => {
	const url = Cypress.env("LOCAL_URL");
	const email = uuidv4() + "@email.com";
	const password = uuidv4();
	const mock = getMockData();

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

	context("Creating new categories and subcategories", () => {
		beforeEach(() => {
			cy.visit(url + "/budget");
			cy.get('[data-test-id="topbar"] button').eq(2).click();
		});

		it("creates individual categories", () => {
			// Creating all but the first mock.category
			for (let i = 1; i < mock.categories.length; i++) {
				cy.get("header button").eq(0).click();
				cy.get('[data-test-id="category-template"] input').type(mock.categories[i].name + "{enter}");
			}

			for (let i = 1; i < mock.categories.length; i++) {
				cy.get('[data-test-id="edit-category-item"]')
					.eq(i - 1)
					.within(() => {
						cy.get("input").should("have.value", mock.categories[i].name);
					});
			}

			// Returns to budget-page
			cy.get("header button").eq(1).click();

			// Checks the budget page is updated (thus, firebase is updated)
			for (let i = 1; i < mock.categories.length; i++) {
				cy.get('[data-test-id="category-item"]')
					.eq(i - 1)
					.within(() => {
						cy.get("span").contains(mock.categories[i].name);
					});
			}
		});

		it("creates individual subcategories", () => {
			// Creating subcategories for all but the first mock.category
			for (let i = 1; i < mock.categories.length; i++) {
				const filteredSubcategories = mock.subcategories.filter((subcategory) => subcategory.categoryID === mock.categories[i].id);

				for (let subcategory of filteredSubcategories) {
					cy.get('[data-test-id="edit-category-item"')
						.eq(i - 1)
						.within(() => {
							cy.get("button").eq(1).click();
						});
					cy.get('[data-test-id="subcategory-template"] input').type(subcategory.name + "{enter}");
				}
			}

			const expectedSubcategories: Subcategory[] = [];
			for (let i = 1; i < mock.categories.length; i++) {
				const category = mock.categories[i];
				const filteredSubcategories = mock.subcategories.filter((subcategory) => subcategory.categoryID === category.id);
				for (let subcategory of filteredSubcategories) {
					expectedSubcategories.push(subcategory);
				}
			}

			for (let i = 0; i < expectedSubcategories.length; i++) {
				cy.get('[data-test-id="edit-subcategory-item"')
					.eq(i)
					.within(() => {
						cy.get("input").should("have.value", expectedSubcategories[i].name);
					});
			}

			// Returns to budget-page
			cy.get("header button").eq(1).click();

			// Checks the budget page is updated (thus, firebase is updated)
			for (let i = 0; i < expectedSubcategories.length; i++) {
				cy.get('[data-test-id="subcategory-item"]')
					.eq(i)
					.within(() => {
						cy.get("span").eq(0).contains(expectedSubcategories[i].name);
					});
			}
		});

		it("creates a category with nested subcategories", () => {
			const categoryToCreate = mock.categories[0];
			const subcategoriesToCreate = mock.subcategories.filter((subcategory) => subcategory.categoryID === categoryToCreate.id);

			// Creating the category
			cy.get("header button").eq(0).click();
			cy.get('[data-test-id="category-template"] input').type(categoryToCreate.name + "{enter}");

			// Creating its subcategories
			for (let subcategory of subcategoriesToCreate) {
				cy.get('[data-test-id="edit-category-item"]')
					.eq(0)
					.within(() => {
						cy.get("button").eq(1).click();
					});
				cy.get('[data-test-id="subcategory-template"] input').type(subcategory.name + "{enter}");
			}

			// Checks edit page for all correct categories & subcategories
			for (let i = 0; i < mock.categories.length; i++) {
				cy.get('[data-test-id="edit-category-item"]')
					.eq(i)
					.within(() => {
						cy.get("input").should("have.value", mock.categories[i].name);
					});
			}

			const expectedSubcategories: Subcategory[] = [];
			for (let i = 0; i < mock.categories.length; i++) {
				const category = mock.categories[i];
				const filteredSubcategories = mock.subcategories.filter((subcategory) => subcategory.categoryID === category.id);
				for (let subcategory of filteredSubcategories) {
					expectedSubcategories.push(subcategory);
				}
			}
			for (let i = 0; i < expectedSubcategories.length; i++) {
				cy.get('[data-test-id="edit-subcategory-item"]')
					.eq(i)
					.within(() => {
						cy.get("input").should("have.value", expectedSubcategories[i].name);
					});
			}

			// Returns to budget-page
			cy.get("header button").eq(1).click();

			// Checks the budget page is updated (thus, firebase is updated)
			for (let i = 0; i < mock.categories.length; i++) {
				cy.get('[data-test-id="category-item"]')
					.eq(i)
					.within(() => {
						cy.get("span").eq(0).contains(mock.categories[i].name);
					});
			}
			for (let i = 0; i < expectedSubcategories.length; i++) {
				cy.get('[data-test-id="subcategory-item"]')
					.eq(i)
					.within(() => {
						cy.get("span").eq(0).contains(expectedSubcategories[i].name);
					});
			}
		});
	});

	context("Moving subcategories", () => {
		beforeEach(() => {
			cy.visit(url + "/budget");
			cy.get('[data-test-id="topbar"] button').eq(2).click();
		});

		it('moves "Food" from "Essential" to "Nonessential"', () => {
			const oldIndex = 0;
			const newIndex = 2;
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(oldIndex)
				.within(() => {
					cy.get("button").eq(1).click();
				});
			cy.get('[data-test-id="category-selection-1"]').click();
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(newIndex)
				.within(() => {
					cy.get("input").should("have.value", "Food");
				});
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(oldIndex)
				.within(() => {
					cy.get("input").should("not.have.value", "Food");
				});
		});

		it('moves "Video Games" from "Nonessential" to "Subscriptions"', () => {
			const oldIndex = 4;
			const newIndex = 7;
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(oldIndex)
				.within(() => {
					cy.get("button").eq(1).click();
				});
			cy.get('[data-test-id="category-selection-2"]').click();
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(newIndex)
				.within(() => {
					cy.get("input").should("have.value", "Video Games");
				});
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(oldIndex)
				.within(() => {
					cy.get("input").should("not.have.value", "Video Games");
				});
		});

		it('moves "Crunchyroll" from "Subscriptions" to "Essential"', () => {
			const oldIndex = 5;
			const newIndex = 0;
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(oldIndex)
				.within(() => {
					cy.get("button").eq(1).click();
				});
			cy.get('[data-test-id="category-selection-0"]').click();
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(newIndex)
				.within(() => {
					cy.get("input").should("have.value", "Crunchyroll");
				});
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(oldIndex)
				.within(() => {
					cy.get("input").should("not.have.value", "Crunchyroll");
				});

			cy.get("header button").eq(1).click();
			const expectedSubcategoryNames = ["Crunchyroll", "Gas", "Student Loans", "Food", "Ice Cream", "Weed", "Netflix", "Video Games"];
			for (let i = 0; i < 7; i++) {
				cy.get('[data-test-id="subcategory-item"]')
					.eq(i)
					.within(() => {
						cy.get("span").eq(0).should("have.text", expectedSubcategoryNames[i]);
					});
			}
		});
	});
});
