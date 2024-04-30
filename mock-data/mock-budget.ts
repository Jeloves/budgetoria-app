import { Account, Allocation, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { NIL as NIL_UUID } from "uuid";

const budgetCreationDate = new Date(2024, 0, 1);

const budget = new Budget(uuidv4(), "My Budget", Timestamp.fromDate(budgetCreationDate), "USD", "en-US", true, 0);

// Accounts
const initialBalance_checkings: number = 8500;
const account_checkings = new Account(uuidv4(), "Checkings", initialBalance_checkings * 1000000, initialBalance_checkings * 1000000);
budget.unassignedBalance += account_checkings.balance;

const initialBalance_credit: number = 0;
const account_credit = new Account(uuidv4(), "Credit", initialBalance_credit * 1000000, initialBalance_credit * 1000000);
budget.unassignedBalance += account_credit.balance;

const initialBalance_savings: number = 2500;
const account_savings = new Account(uuidv4(), "Savings", initialBalance_savings * 1000000, initialBalance_savings * 1000000);
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
const subcategory_nordVPN = new Subcategory(uuidv4(), "NordVPN", category_subscriptions.id);
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
const allocationBalance_nordVPN_january = 9.97;
const allocation_food_jan = new Allocation(uuidv4(), 2024, 0, allocationBalance_food_january * 1000000, subcategory_food.id);
const allocation_gas_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_gas_january * 1000000, subcategory_gas.id);
const allocation_studentLoans_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_studentLoans_january * 1000000, subcategory_studentLoans.id);
const allocation_iceCream_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_iceCream_january * 1000000, subcategory_iceCream.id);
const allocation_weed_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_weed_january * 1000000, subcategory_weed.id);
const allocation_videoGames_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_videoGames_january * 1000000, subcategory_videoGames.id);
const allocation_crunchyroll_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_crunchyroll_january * 1000000, subcategory_crunchyroll.id);
const allocation_netflix_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_netflix_january * 1000000, subcategory_netflix.id);
const allocation_nordVPN_january = new Allocation(uuidv4(), 2024, 0, allocationBalance_nordVPN_january * 1000000, subcategory_nordVPN.id);

const allocations_january = [
	allocation_food_jan,
	allocation_gas_january,
	allocation_studentLoans_january,
	allocation_iceCream_january,
	allocation_weed_january,
	allocation_videoGames_january,
	allocation_crunchyroll_january,
	allocation_netflix_january,
	allocation_nordVPN_january,
];

for (let allocation of allocations_january) {
    budget.unassignedBalance -= allocation.balance;
}


// Transactions
/* Payees */
const payees = [
    "Weis Markets"
]


/* January */
const timestamp_january1 = Timestamp.fromDate(new Date(2024, 0, 1));
const timestamp_january10 = Timestamp.fromDate(new Date(2024, 0, 1));
const timestamp_january20 = Timestamp.fromDate(new Date(2024, 0, 1));

const transactionBalance_food_january = 287.65;
const transactionBalance_gas_january = 44.77;
const transactionBalance_studentLoans_january = 250;
const transactionBalance_iceCream_january = 11.45;
const transactionBalance_weed_january = 125.38;
const transactionBalance_videoGames_january = 80.54;
const transactionBalance_crunchyroll_january = 11.99;
const transactionBalance_netflix_january = 13.99;
const transactionBalance_nordVPN_january = 9.97;
/*
const transaction_food_january = new Transaction(uuidv4(), timestamp_january1, "Weis Markets", "Groceries", true, transactionBalance_food_january * 1000000, true,);
const transaction_gas_january = new Transaction();
const transaction_studentLoans_january = new Transaction();
const transaction_iceCream_january = new Transaction();
const transaction_weed_january = new Transaction();
const transaction_videoGames_january = new Transaction();
const transaction_crunchyroll_january = new Transaction();
const transaction_netflix_january = new Transaction();
const transaction_nordVPN_january = new Transaction();
*/

