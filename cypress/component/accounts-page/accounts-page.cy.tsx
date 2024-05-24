import React from "react";
import { AccountsPage } from "@/features/accounts-page/accounts-page";
import { getMockData } from "../../support/mock";
import { createAccount } from "@/firebase/accounts";
import { createTransaction } from "@/firebase/transactions";
import { sortAccountsAlphabetically } from "@/utils/sorting";
import { clearAccountsAndTransactions } from "../../support/firebase";
import { getSubcategoryNameByID } from "@/utils/getByID";
import { formatCurrencyBasedOnOutflow } from "@/utils/currency";
import { v4 as uuidv4 } from "uuid";

describe("<AccountsPage />", () => {
	const mock = getMockData();
	const budgetData = {
		userID: uuidv4(),
		budgetID: mock.budget.id,
		year: 2024,
		month: 2,
	};

	before(() => {
		// Adding accounts to firebase
		for (let account of mock.accounts) {
			createAccount(budgetData.userID, budgetData.budgetID, account);
		}

		// Adding transactions to firebase
		for (let transaction of mock.transactions) {
			createTransaction(budgetData.userID, budgetData.budgetID, transaction);
		}
	});

	context("Constant texts and images", () => {
		beforeEach(() => {
			cy.mount(<AccountsPage budgetData={budgetData} categories={mock.categories} subcategories={mock.subcategories} />);
		});

		it("shows 'Accounts' as the header text", () => {
			cy.get('[data-test-id="accounts-page-header"]').should("have.text", "Accounts");
		});

		it("shows the correct text and image for 'New Transactions' button", () => {
			cy.get('[data-test-id="unfinished-transactions-button"]').should("have.text", "New Transactions");
			cy.get('[data-test-id="unfinished-transactions-button"] img').should("have.attr", "src", "/icons/arrow-right.svg");
		});

		it("shows the correct text and image for 'All Accounts' button", () => {
			// Only "Add Accounts" button is shown
			cy.get('[data-test-id="all-accounts-button"]').should("have.text", "All Accounts");
			cy.get('[data-test-id="all-accounts-button"] img').should("have.attr", "src", "/icons/arrow-right.svg");
		});

		it("shows 'Budget' as the total balance label", () => {
			cy.get('[data-test-id="total-item"] span').eq(0).should("have.text", "Budget");
		});

		it("shows the correct text and image for 'Add Accounts' button", () => {
			// Only "Add Accounts" button is shown
			cy.get('[data-test-id="add-accounts-button"]').should("have.text", "Add Accounts");
			cy.get('[data-test-id="add-accounts-button"] img').should("have.attr", "src", "/icons/arrow-right.svg");
		});
	});

	context("New user's first navigation", () => {
		beforeEach(() => {
			cy.mount(<AccountsPage budgetData={budgetData} categories={[]} subcategories={[]} />);
		});

		it("shows '$0.00' as the total balance amount", () => {
			cy.get('[data-test-id="total-item"] span').eq(1).should("have.text", "$0.00");
		});

		it("doesn't show any account items", () => {
			cy.get(`[data-test-id="account-item-0"]`).should("not.exist");
		})

		it("shows 'Add Accounts' as the only button", () => {
			// Only "Add Accounts" button is shown
			cy.get('[data-test-id="add-accounts-button"]').should("exist");
			cy.get('[data-test-id="all-accounts-button"]').should("not.exist");
			cy.get('[data-test-id="unfinished-transactions-button"]').should("not.exist");
		});
	});

	context("Shows correct user data", () => {
		beforeEach(() => {
			cy.mount(<AccountsPage budgetData={budgetData} categories={mock.categories} subcategories={mock.subcategories} />);
		});
	
		it("shows the correct total balance", () => {
			let totalBalance = 0;
			for (let account of mock.accounts) {
				totalBalance += account.balance;
			}
	
			let totalBalanceString = "";
			if (totalBalance >= 0) {
				totalBalanceString = "$" + (totalBalance / 1000000).toFixed(2);
			} else {
				totalBalanceString = "-$" + (totalBalance / -1000000).toFixed(2);
			}
	
			cy.get('[data-test-id="total-item"] span').eq(1).should("have.text", totalBalanceString);
		});
	
		it("shows the correct account labels and balances", () => {
			for (let i = 0; i < mock.accounts.length; i++) {
				const account = mock.accounts[i];
				let balanceString = "";
				if (account.balance >= 0) {
					balanceString = "$" + (account.balance / 1000000).toFixed(2);
				} else {
					balanceString = "-$" + (account.balance / -1000000).toFixed(2);
				}
	
				cy.get(`[data-test-id="account-item-${i}"] span`).eq(0).should("have.text", account.name);
				cy.get(`[data-test-id="account-item-${i}"] span`).eq(1).should("have.text", balanceString);
			}
		});
	});
});
