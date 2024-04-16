import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app, collectionLabel, firestore } from "@/firebase/firebase.config";
import { createInitialBudget } from "@/firebase/initial-budget";

// https://firebase.google.com/docs/reference/js/auth#autherrorcodes <-- list of error codes for firebase auth

const firebaseApp = app;
export const auth = getAuth();

const errorMessages = [
	{ errorCode: "auth/email-already-in-use", message: "Email is already in use." },
	{ errorCode: "auth/invalid-credential", message: "Email or password is incorrect." },
];

function getErrorMessage(error: string): string {
	let errorMessage = error;
	for (const errorMapObject of errorMessages) {
		if (error.includes(errorMapObject.errorCode)) {
			errorMessage = errorMapObject.message;
			break;
		}
	}
	return errorMessage;
}

export function createUser(email: string, password: string) {
	return new Promise((resolve, reject) => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				return resolve(userCredential.user.uid as string);
			})
			.catch((error) => {
				console.error("Error Code", error.code);
				return reject(getErrorMessage(error.code));
			});
	});
}

export function signInUser(email: string, password: string) {
	return new Promise((resolve, reject) => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				return resolve(userCredential.user);
			})
			.catch((error) => {
				console.error("Error Code", error.code);
				return reject(getErrorMessage(error.code));
			});
	});
}

export function deleteCurrentUser() {
	const user = getUser();
	if (user) {
		user!.delete;
		console.log("User deleted", user);
	} else {
		console.log("Cannot delete user - no user logged in.");
	}
}

export function getUser() {
	return auth.currentUser;
}
