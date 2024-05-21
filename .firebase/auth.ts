import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, getRedirectResult, signInWithRedirect, signInWithPopup, signOut, deleteUser, connectAuthEmulator } from "firebase/auth";
import { app, isTesting } from "@/firebase/firebase.config";
import { GoogleAuthProvider } from "firebase/auth";

// https://firebase.google.com/docs/reference/js/auth#autherrorcodes <-- list of error codes for firebase auth

const firebaseApp = app;
export const auth = getAuth();
isTesting && connectAuthEmulator(auth, process.env.NEXT_PUBLIC_AUTH_EMULATOR_DOMAIN!);

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

export function signInWithGoogle() {
	const googleProvider = new GoogleAuthProvider();
	signInWithPopup(auth, googleProvider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			// The signed-in user info.
			const user = result.user;
			// IdP data available using getAdditionalUserInfo(result)
			// ...
			console.log("user", user);
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			console.error(errorMessage);
			// ...
		});
}

export function deleteCurrentUser() {
	return new Promise<void>((resolve, reject) => {
		deleteUser(auth.currentUser!)
			.then(() => {
				return resolve();
			})
			.catch((error) => {
				return reject(error);
			});
	});
}

export function signOutUser() {
	return new Promise<void>((resolve, reject) => {
		signOut(auth)
			.then(() => {
				return resolve();
			})
			.catch((error) => {
				return reject(error);
			});
	});
}

export function getUser() {
	return auth.currentUser;
}