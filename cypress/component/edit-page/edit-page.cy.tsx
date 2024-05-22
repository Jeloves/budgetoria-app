import { EditPage } from "@/features/edit-page";
import { getMockData } from "../../support/mock";
import { Subcategory } from "@/firebase/models";

describe("<EditPage/>", () => {
	const mock = getMockData();
	const budgetData = {
		userID: "",
		budgetID: mock.budget.id,
		year: 2024,
		month: 2,
	};

	beforeEach(() => {
		cy.mount(<EditPage budgetData={budgetData} categories={mock.categories} subcategories={mock.subcategories} handleFinishEdits={() => {}} />);
	});

	it("show the correct header", () => {
		cy.get("header img").should("have.attr", "src", "/icons/add-folder.svg");
		cy.get("header").contains("Edit Categories");
		cy.get("header button").eq(1).should("have.text", "Done");
	});

	it("shows the correct categories", () => {
		for (let i = 0; i < mock.categories.length; i++) {
			cy.get('[data-test-id="edit-category-item"]')
				.eq(i)
				.within(() => {
					cy.get("input").should("have.value", mock.categories[i].name);
				});
		}
	});

	it("shows the correct subcategories", () => {
		const orderedSubcategories: Subcategory[] = [];
		for (let category of mock.categories) {
			const filteredSubcategories = mock.subcategories.filter((subcategory) => subcategory.categoryID === category.id);

			for (let subcategory of filteredSubcategories) {
				orderedSubcategories.push(subcategory);
			}
		}

		for (let i = 0; i < orderedSubcategories.length; i++) {
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(i)
				.within(() => {
					cy.get("input").should("have.value", orderedSubcategories[i].name);
				});
		}
	});

	it("shows the correct icons", () => {
		for (let i = 0; i < mock.categories.length; i++) {
			cy.get('[data-test-id="edit-category-item"]')
				.eq(i)
				.within(() => {
					cy.get("img").eq(0).should("have.attr", "src", "/icons/circled-minus.svg");
					cy.get("img").eq(1).should("have.attr", "src", "/icons/circled-plus.svg");
				});
		}

		for (let i = 0; i < mock.subcategories.length; i++) {
			cy.get('[data-test-id="edit-subcategory-item"]')
				.eq(i)
				.within(() => {
					cy.get("img").eq(0).should("have.attr", "src", "/icons/minus.svg");
					cy.get("img").eq(1).should("have.attr", "src", "/icons/reorder.svg");
				});
		}
	});

	it("shows the template category", () => {
		cy.get("header button").eq(0).click();
		cy.get('[data-test-id="category-template"]').should("exist");
		cy.get('[data-test-id="category-template"] input').should("have.value", "");
		cy.get('[data-test-id="category-template"] img').should("have.attr", "src", "/icons/circled-minus.svg");
		cy.get("header img").should("have.attr", "src", "/icons/delete-folder.svg");
	});

	it("hides the template category", () => {
		cy.get("header button").eq(0).click();
		cy.get('[data-test-id="category-template"]').should("exist");
		cy.get("header button").eq(0).click();
		cy.get('[data-test-id="category-template"]').should("not.exist");

		cy.get("header button").eq(0).click();
		cy.get('[data-test-id="category-template"]').should("exist");
		cy.get('[data-test-id="category-template"] button').click();
		cy.get('[data-test-id="category-template"]').should("not.exist");
	});

	it("shows the template subcategory", () => {
		for (let i = 0; i < mock.categories.length; i++) {
			cy.get('[data-test-id="edit-category-item"]')
				.eq(i)
				.within(() => {
					cy.get("button").eq(1).click();
					cy.get("img").eq(1).should("have.attr", "src", "/icons/minus.svg");
				});
			cy.get('[data-test-id="subcategory-template"]').should("exist");
			cy.get('[data-test-id="subcategory-template"] input').should("have.value", "");
			cy.get('[data-test-id="subcategory-template"] img').should("have.attr", "src", "/icons/circled-minus.svg");
		}
	});

	it("hides the template subcategory", () => {
		for (let i = 0; i < mock.categories.length; i++) {
			cy.get('[data-test-id="edit-category-item"]')
				.eq(i)
				.within(() => {
					cy.get("button").eq(1).click();
				});
			cy.get('[data-test-id="subcategory-template"]').should("exist");
			cy.get('[data-test-id="edit-category-item"]')
				.eq(i)
				.within(() => {
					cy.get("button").eq(1).click();
					cy.get("img").eq(1).should("have.attr", "src", "/icons/circled-plus.svg");
				});
			cy.get('[data-test-id="subcategory-template"]').should("not.exist");

			cy.get('[data-test-id="edit-category-item"]')
				.eq(i)
				.within(() => {
					cy.get("button").eq(1).click();
				});
			cy.get('[data-test-id="subcategory-template"]').should("exist");
			cy.get('[data-test-id="subcategory-template"] button').click();
			cy.get('[data-test-id="subcategory-template"]').should("not.exist");
			cy.get('[data-test-id="edit-category-item"]')
				.eq(i)
				.within(() => {
					cy.get("img").eq(1).should("have.attr", "src", "/icons/circled-plus.svg");
				});
		}
	});
});
