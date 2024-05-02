import { createBudget } from "@/firebase/budgets";
import { firestore } from "@/firebase/firebase.config";
import { connectFirestoreEmulator } from "firebase/firestore";

describe('Firestore Emulator Tests', () => {

    before(() => {
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    })
    it('should write data to Firestore emulator', () => {
      const budgetID = "hello_budget";
      const userID = 'hello_user';
      createBudget(userID, budgetID);
    });
  });
  