import React from "react";
import { AccountsPage } from "@/features/accounts-page/accounts-page";
import { getMockData } from "../../support/mock";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { createAccount } from "@/firebase/accounts";
import { createTransaction } from "@/firebase/transactions";
import { sortAccountsAlphabetically } from "@/utils/sorting";
import { firestore } from "@/firebase/firebase.config";
import { Timestamp, connectFirestoreEmulator } from "firebase/firestore";
import { clearAccountsAndTransactions } from "../../support/firebase";
import { BudgetData } from "pages/budget";
import { getAccountNameByID, getSubcategoryNameByID } from "@/utils/getByID";
import { cloneDeep } from "lodash";
import { mock } from "node:test";

describe("<AccountsPage />", () => {
	let userID: string;
	let budgetID: string;
	let budgetData: BudgetData;
	let mockAccounts: Account[];
	let mockCategories: Category[];
	let mockSubcategories: Subcategory[];
	let mockTransactions: Transaction[];

	before(() => {
		connectFirestoreEmulator(firestore, "127.0.0.1", 8080);

		// Retrieving env variables
		userID = Cypress.env("TEST_USER_ID");
		budgetID = Cypress.env("TEST_BUDGET_ID");
		budgetData = { userID: userID, budgetID: budgetID, year: 2024, month: 0 };

		const mock = getMockData();
		mockAccounts = mock.accounts;
		mockCategories = mock.categories;
		mockSubcategories = mock.subcategories;
		mockTransactions = mock.transactions;

		// Adding accounts to firebase (deleted after tests)
		for (let account of mockAccounts) {
			createAccount(userID, budgetID, account);
		}

		// Adding transactions to firebase (deleted after tests)
		for (let transaction of mockTransactions) {
			createTransaction(userID, budgetID, transaction);
		}

		sortAccountsAlphabetically(mockAccounts);
	});

	after(() => {
		// Deletes all accounts and transactions in firebase
		clearAccountsAndTransactions(userID, budgetID);
	});

	context("Constant texts and images", () => {
		beforeEach(() => {
			cy.mount(<AccountsPage budgetData={budgetData} categories={mockCategories} subcategories={mockSubcategories} />);
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
			cy.mount(<AccountsPage budgetData={budgetData} categories={[]} subcategories={[]} />);
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
		beforeEach(() => {
			cy.mount(<AccountsPage budgetData={budgetData} categories={mockCategories} subcategories={mockSubcategories} />);
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

	context("AccountTransactionsSubpage", () => {
		beforeEach(() => {
			cy.mount(<AccountsPage budgetData={budgetData} categories={mockCategories} subcategories={mockSubcategories} />);
		});

		it("shows correct data for 'Checkings' AccountTransactions subpage", () => {
			const checkingsTransactions = mockTransactions.filter((transaction) => transaction.accountID === mockAccounts[0].id);

			cy.get('[data-test-id="account_item_0"]').click();
			cy.wait(300);
			for (let i = 0; i < checkingsTransactions.length; i++) {
				const transaction = checkingsTransactions[i];
				const expectedPayee = transaction.payee === "" ? "Payee Needed" : transaction.payee;
				const expectedSubcategory = transaction.subcategoryID === "" ? "Category Needed" : getSubcategoryNameByID(transaction.subcategoryID, mockSubcategories);
				const expectedAccount = transaction.accountID === "" ? "Account Needed" : getAccountNameByID(transaction.accountID, mockAccounts);

				cy.get(`[data-test-id="account_transaction_item_${i}_payee`).should("have.text", expectedPayee);
				cy.get(`[data-test-id="account_transaction_item_${i}_subcategory`).should("have.text", expectedSubcategory);
				cy.get(`[data-test-id="account_transaction_item_${i}_account`).should("not.exist");
			}

			cy.get(`[data-test-id="account_transaction_item_${checkingsTransactions.length}_payee`).should("have.text", "Starting Balance");
			cy.get(`[data-test-id="account_transaction_item_${checkingsTransactions.length}_subcategory`).should("have.text", "Ready to Assign");
			cy.get(`[data-test-id="account_transaction_item_${checkingsTransactions.length}_account`).should("not.exist");
		});

		it("shows correct data for 'Credit' AccountTransactions subpage", () => {
			const creditTransactions = mockTransactions.filter((transaction) => transaction.accountID === mockAccounts[1].id);

			cy.get('[data-test-id="account_item_1"]').click();
			cy.wait(300);
			for (let i = 0; i < creditTransactions.length; i++) {
				const transaction = creditTransactions[i];
				const expectedPayee = transaction.payee === "" ? "Payee Needed" : transaction.payee;
				const expectedSubcategory = transaction.subcategoryID === "" ? "Category Needed" : getSubcategoryNameByID(transaction.subcategoryID, mockSubcategories);

				cy.get(`[data-test-id="account_transaction_item_${i}_payee`).should("have.text", expectedPayee);
				cy.get(`[data-test-id="account_transaction_item_${i}_subcategory`).should("have.text", expectedSubcategory);
				cy.get(`[data-test-id="account_transaction_item_${i}_account`).should("not.exist");
			}

			cy.get(`[data-test-id="account_transaction_item_${creditTransactions.length}_payee`).should("have.text", "Starting Balance");
			cy.get(`[data-test-id="account_transaction_item_${creditTransactions.length}_subcategory`).should("have.text", "Ready to Assign");
			cy.get(`[data-test-id="account_transaction_item_${creditTransactions.length}_account`).should("not.exist");
		});

		it("shows correct data for 'Savings' AccountTransactions subpage", () => {
			const savingsTransactions = mockTransactions.filter((transaction) => transaction.accountID === mockAccounts[2].id);

			cy.get('[data-test-id="account_item_2"]').click();
			cy.wait(300);
			for (let i = 0; i < savingsTransactions.length; i++) {
				const transaction = savingsTransactions[i];
				const expectedPayee = transaction.payee === "" ? "Payee Needed" : transaction.payee;
				const expectedSubcategory = transaction.subcategoryID === "" ? "Category Needed" : getSubcategoryNameByID(transaction.subcategoryID, mockSubcategories);

				cy.get(`[data-test-id="account_transaction_item_${i}_payee`).should("have.text", expectedPayee);
				cy.get(`[data-test-id="account_transaction_item_${i}_subcategory`).should("have.text", expectedSubcategory);
				cy.get(`[data-test-id="account_transaction_item_${i}_account`).should("not.exist");
			}

			cy.get(`[data-test-id="account_transaction_item_${savingsTransactions.length}_payee`).should("have.text", "Starting Balance");
			cy.get(`[data-test-id="account_transaction_item_${savingsTransactions.length}_subcategory`).should("have.text", "Ready to Assign");
			cy.get(`[data-test-id="account_transaction_item_${savingsTransactions.length}_account`).should("not.exist");
		});
	});
});
