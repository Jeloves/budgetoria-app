import { Account, Budget, Category, Subcategory, Transaction } from "@/firebase/models";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

let userID: string;
let budgetID: string;
let Accounts: Account[];
let Categories: Category[];
let Subcategories: Subcategory[];

// Timestamps
const january1 = Timestamp.fromDate(new Date(2024, 0, 1));
const january5 = Timestamp.fromDate(new Date(2024, 0, 5));

const budget = new Budget(uuidv4(), "Mock Budget", january1, true, 0);

// Checkings Account
const account_checkings_initialBal = 2500;
const account_checkings = new Account(uuidv4(), "Checkings", january1, account_checkings_initialBal * 1000000, account_checkings_initialBal * 1000000);
// Credit Account
const account_credit_initialBal = -200;
const account_credit = new Account(uuidv4(), "Credit", january1, account_credit_initialBal * 1000000, account_credit_initialBal * 1000000);
// Savings Account
const account_savings_initialBal = -200;
const account_savings = new Account(uuidv4(), "Savings", january5, account_savings_initialBal * 1000000, account_savings_initialBal * 1000000);

/* Categories */
const category_essential = new Category(uuidv4(), "Essential");
const category_nonessential = new Category(uuidv4(), "Nonessential");
const category_subscriptions = new Category(uuidv4(), "Subscriptions");

/* Subcategories */
// Essential
const subcategory_food = new Subcategory(uuidv4(), "Food", category_essential.id);
const subcategory_gas = new Subcategory(uuidv4(), "Gas", category_essential.id);
const subcategory_studentLoans = new Subcategory(uuidv4(), "Student Loans", category_essential.id);
// Nonessential
const subcategory_iceCream = new Subcategory(uuidv4(), "Ice Cream", category_nonessential.id);
const subcategory_weed = new Subcategory(uuidv4(), "Weed", category_nonessential.id);
const subcategory_videoGames = new Subcategory(uuidv4(), "Video Games", category_nonessential.id);
// Subscriptions
const subcategory_crunchyroll = new Subcategory(uuidv4(), "Crunchyroll", category_subscriptions.id);
const subcategory_nordVPN = new Subcategory(uuidv4(), "NordVPN", category_subscriptions.id);
const subcategory_netflix = new Subcategory(uuidv4(), "Netflix", category_subscriptions.id);

/* Transactions */
// Jan 5, Weis Markets, Outflow, Approved, Checkings, Essential, Food
const transaction_balance1 = 275.76;
const transaction1 = new Transaction(uuidv4(), january5, "Weis Markets", "Groceries", true, transaction_balance1 * 1000000, true,account_checkings.id, category_essential.id, subcategory_food.id)

// Updating account balances according to transactions
account_checkings.balance -= transaction1.balance;

// Updating budget unassigned balance


export const getMockData = () => {
    const accounts = [account_checkings, account_credit, account_savings];
    const categories = [category_essential, category_nonessential, category_subscriptions];
    const subcategories = [subcategory_crunchyroll, subcategory_food,subcategory_gas, subcategory_iceCream, subcategory_netflix, subcategory_nordVPN, subcategory_studentLoans, subcategory_videoGames, subcategory_weed];

    // Updating unassigned balance
    for (let account of accounts) {
        budget.unassignedBalance += account.balance;
    }
    budget.unassignedBalance -= transaction1.balance;

    return {
        budget: budget,
        accounts: accounts,
        categories: categories,
        subcategories: subcategories,
        transaction: transaction1,
        emptyTransaction: new Transaction(uuidv4(), Timestamp.fromDate(new Date()), "", "", true, 0, false, "", "", ""),
    }
}