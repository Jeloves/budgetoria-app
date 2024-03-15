import { Timestamp } from "firebase/firestore";

export class Budget {
	id: string;
	name: string;
	dateCreated: Timestamp;
	locale: string;
	currency: string;
	selected: boolean = false;
	unassignedBalance: number = 0;
	accounts = [];
	categories = [];
	subcategories = [];
	allocations = [];
	transactions = [];

	constructor(id: string, name: string, dateCreated: Timestamp, locale: string, currency: string) {
		this.id = id;
		this.name = name;
		this.dateCreated = dateCreated;
		this.locale = locale;
		this.currency = currency;
	}
}

export class Category {
	id: string;
    name: string;
    position: number;
    constructor(id: string, name: string, position: number) {
        this.id = id;
        this.name = name;
        this.position = position;
    }
}

export class Subcategory {
    id: string;
    name: string;
    position: number;
    categoryID: string;
    constructor(id: string, name: string, position: number, categoryID: string) {
        this.id = id;
        this.name = name;
        this.position = position;
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
