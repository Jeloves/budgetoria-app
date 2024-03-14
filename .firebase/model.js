class Budget {
    id;
    name;
    dateCreated;
    locale;
    currency;
    selectedBool = true;
    unassignedBalance = 0;
    accounts = [];
    categories = [];
    subcategories = [];
    allocations = [];
    transactions = [];

    constructor(id, name, dateCreated, locale, currency) {
        this.id = id;
        this.name = name;
        this.dateCreated = dateCreated;
        this.locale = locale;
        this.currency = currency;
    }
}

class Account {
    id;
    name;
    balance;
    constructor(id, name, balance) {
        this.id = id;
        this.name = name;
        this.balance = parseFloat(balance);
    }
}

class Category {
    id;
    name;
    position;
    constructor(id, name, position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }
}

class Subcategory {
    id;
    name;
    position;
    categoryID;
    constructor(id, name, position, categoryID) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.categoryID = categoryID;
    }
}

class Allocation {
    id;
    year;
    month;
    balance;
    subcategoryID;
    constructor(id, year, month, balance, subcategoryID) {
        this.id = id;
        this.year = year;
        this.month = month;
        this.balance = parseFloat(balance);
        this.subcategoryID = subcategoryID;
    }
}

class Transaction {
    id;
    date;
    payee;
    memo;
    balance;
    approval;
    accountID;
    categoryID;
    subcategoryID;
    constructor(id, date, payee, memo, balance, approval, accountID, categoryID, subcategoryID) {
        this.id = id;
        this.date = date;
        this.payee = payee;
        this.memo = memo;
        this.balance = parseFloat(balance);
        this.approval = approval;
        this.accountID = accountID;
        this.categoryID = categoryID;
        this.subcategoryID = subcategoryID;
    }
}


export {
    Budget, Account, Category, Subcategory, Allocation, Transaction
}