/**
 * Helper to convert JS Date() obj to a valid SQL timestamp
 * Because new Date.getTime() returns UTC time anyway, SSR/CSR 
 * timezone skew shouldn't matter
 * 
 * UPDATE: because the Seafowl instance may not be updated when
 * the enduser accesses the app, we switched to fetching and 
 * using 'latest available day' instead of 'today'.
 * 
 * @returns string with a partial ISO date + hh:mm:ss zeros
 */
export const getUTCTodayTimestamp = () =>
  `${new Date(new Date().getTime()).toISOString().slice(0, 10)} 00:00:00`
