import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {app} from "@/firebase/firebase.config"

const firebaseApp = app;
export const auth = getAuth();

export function createUser(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(`New user created: ${user}`)
            return true
        })
        .catch((error) => {
            // https://firebase.google.com/docs/reference/js/auth#autherrorcodes <-- list of error codes for firebase auth
            console.error(error.message)
            return error.code
        });
}

export function signInUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return resolve(userCredential.user)
        })
        .catch((error) => {
            return reject(error.message);
        });
    });
}

export function getUser() {
    return auth.currentUser
}