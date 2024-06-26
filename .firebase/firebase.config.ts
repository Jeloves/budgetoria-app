import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
dotenv.config();

export const isTesting = false;

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const firebaseEmulatorConfig = {
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_AUTH_EMULATOR_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
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
export const app = isTesting ? initializeApp(firebaseEmulatorConfig) : initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

isTesting && connectFirestoreEmulator(firestore, process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST!, parseFloat(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT!));

