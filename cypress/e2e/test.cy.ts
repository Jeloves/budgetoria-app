import { createBudget } from "@/firebase/budgets";
import { firestore } from "@/firebase/firebase.config";
import { connectFirestoreEmulator } from "firebase/firestore";

describe('Firestore Emulator Tests', () => {

    before(() => {
      cy.visit(Cypress.env("BASE_URL"))
    })
    it('should write data to Firestore emulator', () => {
    
    });
  });
  