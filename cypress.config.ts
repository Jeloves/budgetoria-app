import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
		},
	},

	component: {
		devServer: {
			framework: "next",
			bundler: "webpack",
		},
	},

	env: {
		TEST_EMAIL: "cypress_testing@email.com",
		TEST_PASSWORD: "aa5a3671-b39e-4e8b-87af-077467cb722f",
		TEST_USER_ID: "a5v885wvVKVOtjjEkOCqKbbAGq82",
		TEST_BUDGET_ID: "cypress_mock_6a52cd1a-886e-4f1d-9222-4e524792125f",
		FIREBASE_CONFIG: {
			apiKey: "AIzaSyBh1M-BQ6HN_PPgBVQuDkZJ8-2aTmK0irU",
			authDomain: "budgetoria.firebaseapp.com",
			projectId: "budgetoria",
			storageBucket: "budgetoria.appspot.com",
			messagingSenderId: "713558167556",
			appId: "1:713558167556:web:99f9ce1aacea51e4502551",
			measurementId: "G-QG4KE52G5H",
		},
		FIRESTORE_EMULATOR_HOST: "localhost:8080",
	},
});
