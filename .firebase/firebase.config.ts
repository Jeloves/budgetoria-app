// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBh1M-BQ6HN_PPgBVQuDkZJ8-2aTmK0irU",
	authDomain: "budgetoria.firebaseapp.com",
	projectId: "budgetoria",
	storageBucket: "budgetoria.appspot.com",
	messagingSenderId: "713558167556",
	appId: "1:713558167556:web:99f9ce1aacea51e4502551",
	measurementId: "G-QG4KE52G5H",
};

export const collectionLabel = {
	users: "users",
	budgets: "budgets",
	accounts: "accounts",
	categories: "categories",
	subcategories: "subcategories",
	allocations: "allocations",
	transactions: "transactions",
	payees: "payees",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
