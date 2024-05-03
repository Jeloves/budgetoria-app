import { TransactionPage } from "@/features/transaction-page/transaction-page";
import { firestore } from "@/firebase/firebase.config";
import { Account, Category, Subcategory, Transaction } from "@/firebase/models";
import { getMockData } from "./mock";
import { connectFirestoreEmulator } from "firebase/firestore";

describe("<TransactionsPage/>", () => {
    // Retrieving mock data
    const mock = getMockData();
    let userID: string;
    let budgetID = mock.budget.id;

    before(async () => {
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);

        // Retrieving env variables
		userID = Cypress.env("TEST_USER_ID");


    })

    context("Constant texts and images", () => {

    })
})