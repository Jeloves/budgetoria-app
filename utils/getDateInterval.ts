import { DateIntervalType } from "@/features/date-picker/date-picker";
import { Timestamp } from "firebase/firestore";

export function getDateInterval(userID: string, budgetID: string, budgetTimestamp: Timestamp): DateIntervalType {
    const currentDate = new Date();
    let maxMonth = currentDate.getMonth() + 1;
    let maxYear = currentDate.getFullYear();
    

    // If the current date is december, the max date is January the following year.
    if (maxMonth === 12) {
        maxMonth = 0;
        maxYear += 1;
    }

    // minMonth * minYear = the date the budget was created
    const milliseconds = budgetTimestamp.seconds * 1000 + Math.floor(budgetTimestamp.nanoseconds / 1000000)
    const minDate = new Date(milliseconds)

    const minMonth = minDate.getMonth();
    const minYear = minDate.getFullYear();

    return {
        minDate: new Date(minYear, minMonth),
        maxDate: new Date(maxYear, maxMonth),
    }
}