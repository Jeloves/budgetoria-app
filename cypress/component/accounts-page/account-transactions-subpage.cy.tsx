import { AccountTransactionsSubpage } from "@/features/accounts-page/account-transactions-subpage/account-transactions-subpage";
import { getMockData } from "../../support/mock";

describe("<AccountTransactionsSubpage />", () => {
	const mock = getMockData();
	const budgetData = {
		userID: "",
		budgetID: mock.budget.id,
		year: 2024,
		month: 2,
	};

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
	});
});
