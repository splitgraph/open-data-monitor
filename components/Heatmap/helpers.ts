export function shiftDate(date: Date, numDays: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

export function getBeginningTimeForDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function convertToDate(obj: any) {
  return obj instanceof Date ? obj : new Date(obj);
}

export function dateNDaysAgo(numDaysAgo: number): Date {
  return shiftDate(new Date(), -numDaysAgo);
}

export function getRange(count: number): Array<number> {
  const arr = [];
  for (let idx = 0; idx < count; idx++) {
    arr.push(idx);
  }
  return arr;
}