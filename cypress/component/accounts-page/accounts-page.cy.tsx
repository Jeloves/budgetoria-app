import React from "react";
import { AccountsPage } from "@/features/accounts-page/accounts-page";
import { getMockData } from "@/mock-data/mock-budget";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { createAccount, deleteAccount, getAccounts } from "@/firebase/accounts";
import { createTransaction, deleteTransaction, getTransactions } from "@/firebase/transactions";
import { sortAccountsAlphabetically } from "@/utils/sorting";
import { firestore } from "@/firebase/firebase.config";
import { connectFirestoreEmulator } from "firebase/firestore";
import { clearAccountsAndTransactions } from "../../support/firebase";

describe("<AccountsPage />", () => {
	let userID: string;
	let budgetID: string;
	let mockAccounts: Account[];
	let mockCategories: Category[];
	let mockSubcategories: Subcategory[];
	let mockTransactions: Transaction[];

	before(async () => {
		connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
		
		// Retrieving env variables
		userID = Cypress.env("TEST_USER_ID");
		budgetID = Cypress.env("TEST_BUDGET_ID");

		const mock = getMockData();
		mockAccounts = mock.accounts;
		mockCategories = mock.categories;
		mockSubcategories = mock.subcategories;
		mockTransactions = mock.transactions;

		sortAccountsAlphabetically(mockAccounts);
	});

	after(async () => {
		// Deletes all accounts and transactions in firebase
		await clearAccountsAndTransactions(userID, budgetID);
	});

	context("Constant texts and images", () => {
		before(() => {
			// Adding accounts to firebase (deleted after tests)
			for (let account of mockAccounts) {
				createAccount(userID, budgetID, account);
			}

			// Adding transactions to firebase (deleted after tests)
			for (let transaction of mockTransactions) {
				createTransaction(userID, budgetID, transaction);
			}
		});

		beforeEach(() => {
			cy.mount(<AccountsPage userID={userID} budgetID={budgetID} categories={mockCategories} subcategories={mockSubcategories} />);
		});

		it("shows 'Accounts' as the header text", () => {
			cy.get('[data-test-id="accounts_page_header"]').should("have.text", "Accounts");
		});

		it("shows 'Budget' as the total balance label", () => {
			cy.get('[data-test-id="total_item"] span').eq(0).should("have.text", "Budget");
		});

		it("shows the correct text and image for 'New Transactions' button", () => {
			cy.get('[data-test-id="unfinished_transactions_button"]').should("have.text", "New Transactions");
			cy.get('[data-test-id="unfinished_transactions_button"] img').should("have.attr", "src", "/icons/arrow-right.svg");
		});

		it("shows the correct text and image for 'All Accounts' button", () => {
			// Only "Add Accounts" button is shown
			cy.get('[data-test-id="all_accounts_button"]').should("have.text", "All Accounts");
			cy.get('[data-test-id="all_accounts_button"] img').should("have.attr", "src", "/icons/arrow-right.svg");
		});

		it("shows the correct text and image for 'Add Accounts' button", () => {
			// Only "Add Accounts" button is shown
			cy.get('[data-test-id="add_accounts_button"]').should("have.text", "Add Accounts");
			cy.get('[data-test-id="add_accounts_button"] img').should("have.attr", "src", "/icons/arrow-right.svg");
		});
	});

	context("New user's first navigation", () => {
		beforeEach(() => {
			cy.mount(<AccountsPage userID={userID} budgetID={budgetID} categories={[]} subcategories={[]} />);
		});

		it("shows '$0.00' as the total balance amount", () => {
			cy.get('[data-test-id="total_item"] span').eq(1).should("have.text", "$0.00");
		});

		it("shows 'Add Accounts' as the only button", () => {
			// Only "Add Accounts" button is shown
			cy.get('[data-test-id="add_accounts_button"]').should("exist");
			cy.get('[data-test-id="all_accounts_button"]').should("not.exist");
			cy.get('[data-test-id="unfinished_transactions_button"]').should("not.exist");
		});
	});

	context("Shows correct user data", () => {
		before(() => {
			// Adding accounts to firebase (deleted after tests)
			for (let account of mockAccounts) {
				createAccount(userID, budgetID, account);
			}

			// Adding transactions to firebase (deleted after tests)
			for (let transaction of mockTransactions) {
				createTransaction(userID, budgetID, transaction);
			}
		});

		beforeEach(() => {
			cy.mount(<AccountsPage userID={userID} budgetID={budgetID} categories={mockCategories} subcategories={mockSubcategories} />);
		});

		it("shows the correct total balance", () => {
			let totalBalance = 0;
			for (let account of mockAccounts) {
				totalBalance += account.balance;
			}

			let totalBalanceString = "";
			if (totalBalance >= 0) {
				totalBalanceString = "$" + (totalBalance / 1000000).toFixed(2);
			} else {
				totalBalanceString = "-$" + (totalBalance / -1000000).toFixed(2);
			}

			cy.get('[data-test-id="total_item"] span').eq(1).should("have.text", totalBalanceString);
		});

		it("shows the correct account labels and balances", () => {
			for (let i = 0; i < mockAccounts.length; i++) {
				const account = mockAccounts[i];
				let balanceString = "";
				if (account.balance >= 0) {
					balanceString = "$" + (account.balance / 1000000).toFixed(2);
				} else {
					balanceString = "-$" + (account.balance / -1000000).toFixed(2);
				}

				cy.get(`[data-test-id="account_item_${i}"] span`).eq(0).should("have.text", account.name);
				cy.get(`[data-test-id="account_item_${i}"] span`).eq(1).should("have.text", balanceString);
			}
		});
	});

	context("Navigation buttons show subpage", () => {
		before(() => {
			// Adding accounts to firebase (deleted after tests)
			for (let account of mockAccounts) {
				createAccount(userID, budgetID, account);
			}

			// Adding transactions to firebase (deleted after tests)
			for (let transaction of mockTransactions) {
				createTransaction(userID, budgetID, transaction);
			}
		});

		beforeEach(() => {
			cy.mount(<AccountsPage userID={userID} budgetID={budgetID} categories={mockCategories} subcategories={mockSubcategories} />);
		});

		it('opens subpage when "New Transactions" button is clicked', () => {
			cy.get('[data-test-id="unfinished_transactions_button"]').should("exist").click();
			cy.get('[data-test-id="account_transactions_subpage_header"]').should("exist");
		});

		it('opens subpage when "All Accounts" button is clicked', () => {
			cy.get('[data-test-id="all_accounts_button"]').should("exist").click();
			cy.get('[data-test-id="account_transactions_subpage_header"]').should("exist");
		});

		it('opens subpage when "Add Accounts" button is clicked', () => {
			cy.get('[data-test-id="add_accounts_button"]').should("exist").click();
			cy.get('[data-test-id="create_account_subpage_header"]').should("exist");
		});
	});
});
