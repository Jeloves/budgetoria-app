import { TransactionPage } from "@/features/transaction-page/transaction-page";
import { firestore } from "@/firebase/firebase.config";
import { getMockData } from "./mock";
import { Timestamp, connectFirestoreEmulator } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "@/firebase/models";
import { createBudget, deleteUser } from "../../support/firebase";

describe("<TransactionsPage/>", () => {
	// Retrieving mock data
	const mock = getMockData();
	let userID = uuidv4();
	let budgetID = mock.budget.id;

	before(() => {
		connectFirestoreEmulator(firestore, "127.0.0.1", 8080);

		// Creates budget in firebase
		createBudget(userID, mock.budget);
	});

	context("Creating Transaction - constant texts and images", () => {
		beforeEach(() => {
			cy.mount(
				<TransactionPage
					userID={userID}
					budgetID={budgetID}
					categories={mock.categories}
					subcategories={mock.subcategories}
					accounts={mock.accounts}
					transaction={mock.emptyTransaction}
					isCreatingTransaction={true}
					handleCreateTransaction={(newTransaction: Transaction) => {}}
					hideTransactionPage={null}
				/>
			);
		});

		it("shows 'Create Transaction' as the header text", () => {
			cy.get('[data-test-id="transaction-page-header"] span').should("have.text", "Create Transaction");
		});

		it("shows 'Finish' as the Finish Button text", () => {
			cy.get('[data-test-id="transaction-page-header"] button').should("have.text", "Finish");
		});

		it("should only have a span and button in the header", () => {
			cy.get('[data-test-id="transaction-page-header"]')
				.children()
				.each(($childElement, index) => {
					const elementType = $childElement.prop("tagName");
                    if (index === 0 && elementType !== "SPAN") {
                        cy.log("Test failed: Expected SPAN as first child element.");
                        throw new Error("Test failed: Expected SPAN as first child element.");
                    } else if (index === 1 && elementType !== "BUTTON") {
                        cy.log("Test failed: Expected BUTTON as second child element.");
                        throw new Error("Test failed: Expected BUTTON as second child element.");
                    } else if (index > 1) {
                        cy.log("Test failed: Expected exactly 2 child elements.");
                        throw new Error("Test failed: More than 2 child elements found.");
                    }
				});
		});

        it("shows '- Outflow' and '- Inflow' as texts in Flow Selection buttons", () => {
            cy.get('[data-test-id="transaction-page-flow-buttons"] button').eq(0).should("have.text", "- Outflow");
            cy.get('[data-test-id="transaction-page-flow-buttons"] button').eq(1).should("have.text", "+ Inflow");
        })

        it("shows '-$0.00' when balance is set to Outflow", () => {
            cy.get('[data-test-id="transaction-page-flow-buttons"] button').eq(0).click();
            cy.get('[data-test-id="transaction-page-flow-buttons"] input').should("have.value", "-$0.00");
        })

        it("shows '$0.00' when balance is set to Inflow", () => {
            cy.get('[data-test-id="transaction-page-flow-buttons"] button').eq(1).click();
            cy.get('[data-test-id="transaction-page-flow-buttons"] input').should("have.value", "$0.00");
        })
	});
});
