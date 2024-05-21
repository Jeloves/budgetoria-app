import { Account, Allocation, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { getAccountByID } from "@/utils/getByID";
import { sortTransactionsByTimestamp } from "@/utils/sorting";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { NIL as NIL_UUID } from "uuid";

const budgetCreationDate = new Date(2024, 0, 1);

const budget = new Budget(uuidv4(), "My Budget", Timestamp.fromDate(budgetCreationDate), true, 0);

// Accounts
const initialBalance_checkings: number = 8500;
const timestamp_checkings = Timestamp.fromDate(budgetCreationDate);
const account_checkings = new Account(uuidv4(), "Checkings", timestamp_checkings, initialBalance_checkings * 1000000, initialBalance_checkings * 1000000);
budget.unassignedBalance += account_checkings.balance;

const initialBalance_credit: number = 0;
const timestamp_credit = Timestamp.fromDate(budgetCreationDate);
const account_credit = new Account(uuidv4(), "Credit", timestamp_credit, initialBalance_credit * 1000000, initialBalance_credit * 1000000);
budget.unassignedBalance += account_credit.balance;

const initialBalance_savings: number = 2500;
const timestamp_savings = Timestamp.fromDate(new Date(2024, 0, 5));
const account_savings = new Account(uuidv4(), "Savings", timestamp_savings, initialBalance_savings * 1000000, initialBalance_savings * 1000000);
budget.unassignedBalance += account_savings.balance;

// Categories
const category_essential = new Category(uuidv4(), "Essential");
const category_nonessential = new Category(uuidv4(), "Nonessential");
const category_subscriptions = new Category(uuidv4(), "Subscriptions");

/// Subcategories
const subcategory_food = new Subcategory(uuidv4(), "Food", category_essential.id);
const subcategory_gas = new Subcategory(uuidv4(), "Gas", category_essential.id);
const subcategory_studentLoans = new Subcategory(uuidv4(), "Student Loans", category_essential.id);

const subcategory_iceCream = new Subcategory(uuidv4(), "Ice Cream", category_nonessential.id);
const subcategory_weed = new Subcategory(uuidv4(), "Weed", category_nonessential.id);
const subcategory_videoGames = new Subcategory(uuidv4(), "Video Games", category_nonessential.id);

const subcategory_crunchyroll = new Subcategory(uuidv4(), "Crunchyroll", category_subscriptions.id);
const subcategory_netflix = new Subcategory(uuidv4(), "Netflix", category_subscriptions.id);

// Allocations
/* January */
const allocationBalance_food_january = 300;
const allocationBalance_gas_january = 50;
const allocationBalance_studentLoans_january = 250;
const allocationBalance_iceCream_january = 20;
const allocationBalance_weed_january = 150;
const allocationBalance_videoGames_january = 70;
const allocationBalance_crunchyroll_january = 11.99;
const allocationBalance_netflix_january = 13.99;
const allocation_food_jan = new Allocation(uuidv4(), 2024, 0, allocationBalance_food_january * 1000000, subcategory_food.id);
const allocation_gas_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_gas_january * 1000000, subcategory_gas.id);
const allocation_studentLoans_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_studentLoans_january * 1000000, subcategory_studentLoans.id);
const allocation_iceCream_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_iceCream_january * 1000000, subcategory_iceCream.id);
const allocation_weed_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_weed_january * 1000000, subcategory_weed.id);
const allocation_videoGames_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_videoGames_january * 1000000, subcategory_videoGames.id);
const allocation_crunchyroll_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_crunchyroll_january * 1000000, subcategory_crunchyroll.id);
const allocation_netflix_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_netflix_january * 1000000, subcategory_netflix.id);

const allocations_january = [
	allocation_food_jan,
	allocation_gas_january,
	allocation_studentLoans_january,
	allocation_iceCream_january,
	allocation_weed_january,
	allocation_videoGames_january,
	allocation_crunchyroll_january,
	allocation_netflix_january,
];

for (let allocation of allocations_january) {
	budget.unassignedBalance -= allocation.balance;
}

// Transactions
/* Payees */
const payees = ["Weis Markets"];

/* January */
const timestamp_january1_8am = Timestamp.fromDate(new Date(2024, 0, 1, 8));
const timestamp_january1_8_30am = Timestamp.fromDate(new Date(2024, 0, 1, 8, 30));
const timestamp_january1_8pm = Timestamp.fromDate(new Date(2024, 0, 1, 20));
const timestamp_january5_8am = Timestamp.fromDate(new Date(2024, 0, 5, 8));
const timestamp_january5_8_30am = Timestamp.fromDate(new Date(2024, 0, 5, 8, 30));
const timestamp_january5_8pm = Timestamp.fromDate(new Date(2024, 0, 5, 20));
const timestamp_january10_8am = Timestamp.fromDate(new Date(2024, 0, 10, 8));
const timestamp_january10_8_30am = Timestamp.fromDate(new Date(2024, 0, 10, 8, 30));
const timestamp_january10_8pm = Timestamp.fromDate(new Date(2024, 0, 10, 20));
const timestamp_january15_8am = Timestamp.fromDate(new Date(2024, 0, 15, 8));
const timestamp_january15_8_30am = Timestamp.fromDate(new Date(2024, 0, 15, 8, 30));
const timestamp_january15_8pm = Timestamp.fromDate(new Date(2024, 0, 15, 20));

const transactionBalance_food_january = 287.65;
const transactionBalance_gas_january = 44.77;
const transactionBalance_studentLoans_january = 250;
const transactionBalance_iceCream_january = 11.45;
const transactionBalance_weed_january = 35.38;
const transactionBalance_videoGames_january = 80.54;
const transactionBalance_crunchyroll_january = 11.99;
const transactionBalance_netflix_january = 13.99;

// Cleared, Credit, Outflow, Essential, Food
const transaction_food_january = new Transaction(uuidv4(), timestamp_january1_8am, "Weis Markets", "Groceries", true, transactionBalance_food_january * 1000000, true, account_credit.id, category_essential.id, subcategory_food.id);
// Uncleared, Credit, Outflow, Essential, Gas
const transaction_gas_january = new Transaction(uuidv4(), timestamp_january1_8pm, "Royal Farms", "", true, transactionBalance_gas_january * 1000000, false, account_credit.id, category_essential.id, subcategory_gas.id);
// Cleared, Checkings, Outflow, Essential, Student Loans
const transaction_studentLoans_january = new Transaction(
	uuidv4(),
	timestamp_january5_8am,
	"FAFSA",
	"Cancel this please",
	true,
	transactionBalance_studentLoans_january * 1000000,
	true,
	account_checkings.id,
	category_essential.id,
	subcategory_studentLoans.id
);
// Cleared, Checkings, Outflow, Nonessential, Ice Cream
const transaction_iceCream_january = new Transaction(
	uuidv4(),
	timestamp_january5_8pm,
	"Royal Farms",
	"Chocolate and vanilla",
	true,
	transactionBalance_iceCream_january * 1000000,
	true,
	account_checkings.id,
	category_nonessential.id,
	subcategory_iceCream.id
);
// Uncleared, Checkings, Inflow, Nonessential, Ice Cream
const transaction_weed_january = new Transaction(uuidv4(), timestamp_january10_8am, "Curaleaf", "Refunded for bad product", false, transactionBalance_weed_january * 1000000, false, account_checkings.id, category_nonessential.id, subcategory_weed.id);
// Cleared, Savings, Outflow, Nonessential, Videogames
const transaction_videoGames_january = new Transaction(
	uuidv4(),
	timestamp_january10_8pm,
	"Steam",
	"ProjectZomboid",
	true,
	transactionBalance_videoGames_january * 1000000,
	true,
	account_savings.id,
	category_nonessential.id,
	subcategory_videoGames.id
);
// Uncleared, Checkings, Outflow, Subscriptions, Crunchyroll
const transaction_crunchyroll_january = new Transaction(uuidv4(), timestamp_january15_8am, "Crunchyroll", "", true, transactionBalance_crunchyroll_january * 1000000, false, account_checkings.id, category_subscriptions.id, subcategory_crunchyroll.id);
// Cleared, Checkings, Outflow, Subscriptions, Netflix
const transaction_netflix_january = new Transaction(uuidv4(), timestamp_january15_8pm, "Netflix", "", true, transactionBalance_netflix_january * 1000000, true, account_checkings.id, category_subscriptions.id, subcategory_netflix.id);

// Unfinished Transactions
const transaction_unfinished1_january = new Transaction(uuidv4(), timestamp_january1_8_30am, "", "", true, 23960000, false, account_checkings.id, "", "");
const transaction_unfinished2_january = new Transaction(uuidv4(), timestamp_january5_8_30am, "", "", true, 41460000, false, account_checkings.id, "", "");
const transaction_unfinished3_january = new Transaction(uuidv4(), timestamp_january10_8_30am, "Weis Markets", "gum", true, 20040000, false, account_checkings.id, "", "");
const transaction_unfinished4_january = new Transaction(uuidv4(), timestamp_january15_8_30am, "Steam", "", true, 26000000, false, "", "", "");

/* February */
const transactionBalance_food_february = 265.65;
const transactionBalance_gas_february = 30.99;
const transactionBalance_studentLoans_february = 250;
const transactionBalance_iceCream_february = 1.5;
const transactionBalance_weed_february = 40;
const transactionBalance_videoGames_february = 75.0;
const transactionBalance_crunchyroll_february = 11.99;
const transactionBalance_netflix_february = 13.99;

const timestamp_february1_8am = Timestamp.fromDate(new Date(2024, 1, 1, 8));
const timestamp_february1_8_30am = Timestamp.fromDate(new Date(2024, 1, 1, 8, 30));
const timestamp_february1_8pm = Timestamp.fromDate(new Date(2024, 1, 1, 20));
const timestamp_february5_8am = Timestamp.fromDate(new Date(2024, 1, 5, 8));
const timestamp_february5_8_30am = Timestamp.fromDate(new Date(2024, 1, 5, 8, 30));
const timestamp_february5_8pm = Timestamp.fromDate(new Date(2024, 1, 5, 20));
const timestamp_february10_8am = Timestamp.fromDate(new Date(2024, 1, 10, 8));
const timestamp_february10_8_30am = Timestamp.fromDate(new Date(2024, 1, 10, 8, 30));
const timestamp_february10_8pm = Timestamp.fromDate(new Date(2024, 1, 10, 20));
const timestamp_february15_8am = Timestamp.fromDate(new Date(2024, 1, 15, 8));
const timestamp_february15_8_30am = Timestamp.fromDate(new Date(2024, 1, 15, 8, 30));
const timestamp_february15_8pm = Timestamp.fromDate(new Date(2024, 1, 15, 20));


// Cleared, Credit, Outflow, Essential, Food
const transaction_food_february = new Transaction(uuidv4(), timestamp_february1_8am, "Weis Markets", "Groceries", true, transactionBalance_food_february * 1000000, true, account_credit.id, category_essential.id, subcategory_food.id);
// Uncleared, Credit, Outflow, Essential, Gas
const transaction_gas_february = new Transaction(uuidv4(), timestamp_february1_8pm, "Royal Farms", "", true, transactionBalance_gas_february * 1000000, false, account_credit.id, category_essential.id, subcategory_gas.id);
// Cleared, Checkings, Outflow, Essential, Student Loans
const transaction_studentLoans_february = new Transaction(
	uuidv4(),
	timestamp_february5_8am,
	"FAFSA",
	"Cancel this please",
	true,
	transactionBalance_studentLoans_february * 1000000,
	true,
	account_checkings.id,
	category_essential.id,
	subcategory_studentLoans.id
);
// Cleared, Checkings, Outflow, Nonessential, Ice Cream
const transaction_iceCream_february = new Transaction(
	uuidv4(),
	timestamp_february5_8pm,
	"Royal Farms",
	"Chocolate and vanilla",
	true,
	transactionBalance_iceCream_february * 1000000,
	true,
	account_checkings.id,
	category_nonessential.id,
	subcategory_iceCream.id
);
// Uncleared, Checkings, Inflow, Nonessential, Weed
const transaction_weed_february = new Transaction(uuidv4(), timestamp_february10_8am, "Curaleaf", "Refunded for bad product", false, transactionBalance_weed_february * 1000000, false, account_checkings.id, category_nonessential.id, subcategory_weed.id);
// Cleared, Savings, Outflow, Nonessential, Videogames
const transaction_videoGames_february = new Transaction(uuidv4(), timestamp_february10_8pm, "Steam", "ProjectZomboid", true, transactionBalance_videoGames_february * 1000000, true, account_savings.id, category_nonessential.id, subcategory_videoGames.id);
// Uncleared, Checkings, Outflow, Subscriptions, Crunchyroll
const transaction_crunchyroll_february = new Transaction(uuidv4(), timestamp_february15_8am, "Crunchyroll", "", true, transactionBalance_crunchyroll_february * 1000000, false, account_checkings.id, category_subscriptions.id, subcategory_crunchyroll.id);
// Cleared, Checkings, Outflow, Subscriptions, Netflix
const transaction_netflix_february = new Transaction(uuidv4(), timestamp_february15_8pm, "Netflix", "", true, transactionBalance_netflix_february * 1000000, true, account_checkings.id, category_subscriptions.id, subcategory_netflix.id);

// Unfinished Transactions
const transaction_unfinished1_february = new Transaction(uuidv4(), timestamp_february1_8_30am, "", "", true, 13940000, false, account_checkings.id, "", "");
const transaction_unfinished2_february = new Transaction(uuidv4(), timestamp_february5_8_30am, "", "", true, 31430000, false, account_checkings.id, "", "");
const transaction_unfinished3_february = new Transaction(uuidv4(), timestamp_february10_8_30am, "Weis Markets", "gum", true, 12340000, false, account_checkings.id, "", "");
const transaction_unfinished4_february = new Transaction(uuidv4(), timestamp_february15_8_30am, "Steam", "", true, 10000000, false, "", "", "");

const accounts = [account_checkings, account_credit, account_savings];

const transactions = [
	transaction_crunchyroll_january,
	transaction_food_january,
	transaction_gas_january,
	transaction_iceCream_january,
	transaction_netflix_january,
	transaction_studentLoans_january,
	transaction_videoGames_january,
	transaction_weed_january,
	transaction_unfinished1_january,
	transaction_unfinished2_january,
	transaction_unfinished3_january,
	transaction_unfinished4_january,
	transaction_crunchyroll_february,
	transaction_food_february,
	transaction_gas_february,
	transaction_iceCream_february,
	transaction_netflix_february,
	transaction_studentLoans_february,
	transaction_videoGames_february,
	transaction_weed_february,
	transaction_unfinished1_february,
	transaction_unfinished2_february,
	transaction_unfinished3_february,
	transaction_unfinished4_february,
];

for (let account of accounts) {
	const filteredTransactions = transactions.filter((transaction) => transaction.accountID === account.id);
	for (let transaction of filteredTransactions) {
		if (transaction.outflow) {
			account.balance -= transaction.balance;
		} else {
			account.balance += transaction.balance;
		}
	}
}

export function getMockData() {
    sortTransactionsByTimestamp(transactions)
    
	return {
		budget: budget,
		accounts: accounts,
		categories: [category_essential, category_nonessential, category_subscriptions],
		subcategories: [subcategory_crunchyroll, subcategory_food, subcategory_gas, subcategory_gas, subcategory_iceCream, subcategory_netflix, subcategory_studentLoans, subcategory_videoGames, subcategory_weed],
		allocations: [
			allocation_crunchyroll_january,
			allocation_food_jan,
			allocation_gas_january,
			allocation_iceCream_january,
			allocation_netflix_january,
			allocation_studentLoans_january,
			allocation_videoGames_january,
			allocation_weed_january,
		],
		transactions: transactions,
	};
}
