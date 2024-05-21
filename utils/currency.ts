export function formatCurrency(balance: number) {
    if (balance < 0) {
        return "-$" + (balance / -1000000).toFixed(2);
    } else {
        return "$" + (balance / 1000000).toFixed(2);
    }
}

export function formatCurrencyBasedOnOutflow(balance: number, outflow: boolean) {
    if (outflow) {
        return "-$" + (balance / 1000000).toFixed(2);
    } else {
        return "$" + (balance / 1000000).toFixed(2);
    }
}