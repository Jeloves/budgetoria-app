import { Timestamp } from "firebase/firestore";

export class Budget {
	id: string;
	name: string;
	dateCreated: Timestamp;
	locale: string;
	currency: string;
	selected: boolean = false;
	unassignedBalance: number = 0;

	constructor(id: string, name: string, dateCreated: Timestamp, locale: string, currency: string, selected: boolean, unassignedBalance: number) {
		this.id = id;
		this.name = name;
		this.dateCreated = dateCreated;
		this.locale = locale;
		this.currency = currency;
        this.selected = selected;
        this.unassignedBalance = unassignedBalance;
	}
}

export class Account {
    id: string;
    name: string;
    initialBalance: number;
    balance: number;
    constructor(id: string, name: string,initialBalance: number, balance: number) {
        this.id = id;
        this.name = name;
        this.initialBalance = initialBalance;
        this.balance = balance;
    }
}

export class Category {
	id: string;
    name: string;
	assigned: number = 0;
	available: number = 0;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class Subcategory {
    id: string;
    name: string;
    categoryID: string;
	assigned: number = 0;
	available: number = 0;
    constructor(id: string, name: string, categoryID: string) {
        this.id = id;
        this.name = name;
        this.categoryID = categoryID;
    }
}

export class Allocation {
	id: string;
	year: number;
	month: number;
	balance: number;
	subcategoryID: string;
	constructor(id: string, year: number, month: number, balance: number, subcategoryID: string) {
		this.id = id;
		this.year = year;
		this.month = month;
		this.balance = balance;
		this.subcategoryID = subcategoryID;
	}
}

export class Transaction {
    id: string;
    date: Timestamp;
    payee: string;
    memo: string;
    outflow: boolean;
    balance: number;
    approval: boolean;
    accountID: string;
    categoryID: string;
    subcategoryID: string;
    constructor(id: string, date: Timestamp, payee: string, memo: string, outflow: boolean, balance: number, approval: boolean, accountID: string, categoryID: string, subcategoryID: string) {
        this.id = id;
        this.date = date;
        this.payee = payee;
        this.memo = memo;
        this.outflow = outflow;
        this.balance = balance;
        this.approval = approval;
        this.accountID = accountID;
        this.categoryID = categoryID;
        this.subcategoryID = subcategoryID;
    }
}
