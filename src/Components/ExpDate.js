export function expDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // Add one month

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
