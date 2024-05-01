import React from "react";
import { v4 as uuidv4 } from "uuid";
import { NIL as NIL_UUID } from "uuid";
import { AccountsPage } from "@/features/accounts-page/accounts-page";
import { getMockData } from "@/mock-data/mock-budget";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { createAccount, deleteAccount } from "@/firebase/accounts";
import { createTransaction, deleteTransaction } from "@/firebase/transactions";
import { sortAccountsAlphabetically } from "@/utils/sorting";

describe("<AccountsPage />", () => {
	let userID: string;
	let budgetID: string;
	let mockAccounts: Account[];
	let mockCategories: Category[];
	let mockSubcategories: Subcategory[];
	let mockTransactions: Transaction[];

	before(() => {
		// Retrieving env variables
		userID = Cypress.env("TEST_USER_ID");
		budgetID = Cypress.env("TEST_BUDGET_ID");

		const mock = getMockData();
		mockAccounts = mock.accounts;
		mockCategories = mock.categories;
		mockSubcategories = mock.subcategories;
		mockTransactions = mock.transactions;

		sortAccountsAlphabetically(mockAccounts);

		// Adding accounts to firebase (deleted after tests)
		for (let account of mockAccounts) {
			createAccount(userID, budgetID, account);
		}

		// Adding transactions to firebase (deleted after tests)
		for (let transaction of mockTransactions) {
			createTransaction(userID, budgetID, transaction);
		}
	});

	after(() => {
		// Deletes all accounts from firebase
		for (let account of mockAccounts) {
			deleteAccount(userID, budgetID, account.id);
		}

		// Deletes all transactions from firebase
		for (let transaction of mockTransactions) {
			deleteTransaction(userID, budgetID, transaction.id);
		}
	});

	it("renders", () => {
		cy.mount(<AccountsPage userID={userID} budgetID={budgetID} categories={mockCategories} subcategories={mockSubcategories} />);

		const account_checkings = mockAccounts[0];
		const account_credit = mockAccounts[1];
		const account_savings = mockAccounts[2];

		cy.get('[data-test-id="account_item_0"] span').eq(0).should('have.text', account_checkings.name)
		cy.get('[data-test-id="account_item_0"] span').eq(1).should('have.text', "$" + (account_checkings.balance / 1000000).toFixed(2))

		cy.get('[data-test-id="account_item_1"] span').eq(0).should('have.text', account_credit.name)
		cy.get('[data-test-id="account_item_1"] span').eq(1).should('have.text', "$" + (account_credit.balance / 1000000).toFixed(2))

		cy.get('[data-test-id="account_item_2"] span').eq(0).should('have.text',  account_savings.name)
		cy.get('[data-test-id="account_item_2"] span').eq(1).should('have.text', "$" + (account_savings.balance / 1000000).toFixed(2))

	});

});
