import { AccountTransactionsSubpage } from "@/features/accounts-page/account-transactions-subpage/account-transactions-subpage";
import { getMockData } from "../../support/mock";
import { createTransaction } from "@/firebase/transactions";
import { v4 as uuidv4 } from "uuid";

describe("<AccountTransactionsSubpage />", () => {
	const mock = getMockData();
	const budgetData = {
		userID: uuidv4(),
		budgetID: mock.budget.id,
		year: 2024,
		month: 2,
	};

    before(() => {
        // Creates transaction docs in firebase
        for (const transaction of mock.transactions) {
            createTransaction(budgetData.userID, budgetData.budgetID, transaction);
        }
    })

	context("All Accounts", () => {
		beforeEach(() => {
			cy.mount(
				<AccountTransactionsSubpage
					budgetData={budgetData}
					categories={mock.categories}
					subcategories={mock.subcategories}
					accounts={mock.accounts}
					showingAllAccounts={true}
					showingUnfinishedTransactions={false}
					handleBackClick={() => {}}
				/>
			);
		});

        it("shows 'All Accounts' as header text", () => {
            cy.get("header span").should("have.text", "All Accounts")
        })
	});
});
