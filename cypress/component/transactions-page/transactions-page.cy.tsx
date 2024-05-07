import { TransactionPage } from "@/features/transaction-page/transaction-page";
import { firestore } from "@/firebase/firebase.config";
import { getMockData } from "./mock";
import { Timestamp, connectFirestoreEmulator } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "@/firebase/models";
import { createBudget, deleteUser } from "../../support/firebase";
import { getDateStringFromTimestamp } from "@/utils/date";

describe("<TransactionsPage/>", () => {
	// Retrieving mock data
	const mock = getMockData();
	let userID = uuidv4();
	let budgetID = mock.budget.id;
	let budgetData = { userID: userID, budgetID: budgetID, year: 2024, month: 0 };

	before(async () => {
		connectFirestoreEmulator(firestore, "127.0.0.1", 8080);

		// Creates budget in firebase
		await createBudget(userID, mock.budget);
	});

	context("Creating Transaction - constant texts and images", () => {
		beforeEach(() => {
			cy.mount(
				<TransactionPage
					budgetData={budgetData}
					categories={mock.categories}
					subcategories={mock.subcategories}
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
			cy.get('[data-test-id="transaction-page-outflow-button"]').should("have.text", "- Outflow");
			cy.get('[data-test-id="transaction-page-inflow-button"]').should("have.text", "+ Inflow");
		});

		it("shows '-$0.00' when balance is set to Outflow", () => {
			cy.get('[data-test-id="transaction-page-outflow-button"]').click();
			cy.get('[data-test-id="transaction-page-balance-input"]').should("have.value", "-$0.00");
		});

		it("shows '$0.00' when balance is set to Inflow", () => {
			cy.get('[data-test-id="transaction-page-inflow-button"]').click();
            cy.get('[data-test-id="transaction-page-balance-input"]').should("have.value", "$0.00");
		});

		it("displays the correct types and amount of TransactionData items", () => {
			cy.get('[data-test-id="transaction-page-data-container"]')
				.children()
				.each(($childElement, index) => {
					const elementType = $childElement.prop("tagName");
					if (index < 4 && elementType !== "BUTTON") {
						cy.log("Test failed: Expected BUTTON as first-fourth child element.");
						throw new Error("Test failed: Expected BUTTON as first-fourth child element.");
					} else if (index === 4 && elementType !== "DIV") {
						cy.log("Test failed: Expected DIV as fifth child element.");
						throw new Error("Test failed: Expected DIV as fifth child element.");
					} else if (index === 5 && elementType !== "BUTTON") {
						cy.log("Test failed: Expected BUTTON as sixth child element.");
						throw new Error("Test failed: Expected BUTTON as sixth child element.");
						console.log("NICE");
					} else if (index === 6 && elementType !== "DIV") {
						cy.log("Test failed: Expected DIV as seventh child element.");
						throw new Error("Test failed: Expected DIV as seventh child element.");
						console.log("NICE");
					} else if (index === 7 && elementType !== "TEXTAREA") {
						cy.log("Test failed: Expected TEXTAREA as eighth child element.");
						throw new Error("Test failed: Expected TEXTAREA as eighth child element.");
					} else if (index > 7) {
						cy.log("Test failed: Expected only 8 child elements.");
						throw new Error("Test failed: Expected only 8 child elements. Expected max index = 7. Reached index " + index);
					}
				});
		});

		it("shows correct text and icons for Payee TransactionDataItem", () => {
			cy.get('[data-test-id="transaction-payee-item"] h1').should("have.text", "Payee");
			cy.get('[data-test-id="transaction-payee-item"] h2').should("have.text", "Select Payee...");
			cy.get('[data-test-id="transaction-payee-item"] img').eq(0).should("have.attr", "src", "/icons/exchange.svg");
			cy.get('[data-test-id="transaction-payee-item"] img').eq(1).should("have.attr", "src", "/icons/arrow-right-grey-500.svg");
		});

		it("shows correct text and icons for Category TransactionDataItem", () => {
			cy.get('[data-test-id="transaction-category-item"] h1').should("have.text", "Category");
			cy.get('[data-test-id="transaction-category-item"] h2').should("have.text", "Select Category...");
			cy.get('[data-test-id="transaction-category-item"] img').eq(0).should("have.attr", "src", "/icons/cash-grey-100.svg");
			cy.get('[data-test-id="transaction-category-item"] img').eq(1).should("have.attr", "src", "/icons/arrow-right-grey-500.svg");
		});

		it("shows correct text and icons for Account TransactionDataItem", () => {
			cy.get('[data-test-id="transaction-account-item"] h1').should("have.text", "Account");
			cy.get('[data-test-id="transaction-account-item"] h2').should("have.text", "Select Account...");
			cy.get('[data-test-id="transaction-account-item"] img').eq(0).should("have.attr", "src", "/icons/bank-grey-100.svg");
			cy.get('[data-test-id="transaction-account-item"] img').eq(1).should("have.attr", "src", "/icons/arrow-right-grey-500.svg");
		});

		it("shows correct text and icons for Date TransactionDataItem", () => {
			cy.get('[data-test-id="transaction-date-item"] h1').should("have.text", "Date");
			cy.get('[data-test-id="transaction-date-item"] h2').should("have.text", getDateStringFromTimestamp(Timestamp.fromDate(new Date())));
			cy.get('[data-test-id="transaction-date-item"] img').eq(0).should("have.attr", "src", "/icons/calendar-grey-100.svg");
			cy.get('[data-test-id="transaction-date-item"] img').eq(1).should("not.exist");
		});

		it("shows correct text and icons for Approval TransactionDataItem", () => {
			cy.get('[data-test-id="transaction-approval-item"] h2').should("have.text", "Cleared");
			cy.get('[data-test-id="transaction-approval-item"] img').should("have.attr", "src", "/icons/cleared-grey-100.svg");
			cy.get('[data-test-id="transaction-approval-item"] span').click();
			cy.get('[data-test-id="transaction-approval-item"] img').should("have.attr", "src", "/icons/cleared.svg");
		});

		it("shows correct text and icons for Memo TransactionDataItem", () => {
			cy.get('[data-test-id="transaction-memo-item"] h2').should("have.text", "Memo");
			cy.get('[data-test-id="transaction-memo-item"] img').should("have.attr", "src", "/icons/memo-grey-100.svg");
            cy.get('[data-test-id="transaction-memo-textarea"]').should("have.attr", "placeholder", "Enter memo...");
		});
	});

    context("Navigation buttons show subpage", () => {
        beforeEach(() => {
			cy.mount(
				<TransactionPage
					budgetData={budgetData}
					categories={mock.categories}
					subcategories={mock.subcategories}
					transaction={mock.emptyTransaction}
					isCreatingTransaction={true}
					handleCreateTransaction={(newTransaction: Transaction) => {}}
					hideTransactionPage={null}
				/>
			);
		});

        it("navigates to Payee Selection Subpage", () => {
            cy.get('[data-test-id="transaction-payee-item"]').click();
            cy.get('[data-test-id="payee-selection-subpage-header"]').should("exist");
        })

        it("navigates to Category Selection Subpage", () => {
            cy.get('[data-test-id="transaction-category-item"]').click();
            cy.get('[data-test-id="category-selection-subpage-header"]').should("exist");
        })

        it("navigates to Account Selection Subpage", () => {
            cy.get('[data-test-id="transaction-account-item"]').click();
            cy.get('[data-test-id="account-selection-subpage-header"]').should("exist");
        })

        it("displays the Calendar when Date Selection is clicked", () => {
			cy.get('[data-test-id="transaction-calendar-item"]')
				.invoke("height")
				.then((height) => {
					// Use the 'height' variable to access the element's height
					if (height !== 0) {
						cy.log("Test failed: Expected calendar item height to be 0px.");
						throw new Error(`Test failed: Expected height is 0px. Actual height is ${height}`);
					}
				});
			cy.get('[data-test-id="transaction-date-item"]').click();
			cy.get('[data-test-id="transaction-calendar-item"]')
				.invoke("height")
				.then((height) => {
					// Use the 'height' variable to access the element's height
					if (height === 0) {
						cy.log("Test failed: Expected calendar item height to be greater than 0px.");
						throw new Error(`Test failed: Expected height is greater than 0px. Actual height is ${height}`);
					}
				});
		});
    })
});
