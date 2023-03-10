import { type DiffResponse } from "./data/seafowl"

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


/**
 * SQL `timestamp`s require the following to be appended to YYYY-MM-DD
 * We don't want to show that in the URL; thus we need to string manip
 * accordingly. Make the string available to all the places that need.
 * 
*/
export const timestampAppendix = ' 00:00:00'

/** Helper function to extract just id/domain/name from a full DatasetDiff */
export const selectIdNameDomain = (diffData: DiffResponse[] | undefined) =>
  ({ datasets: diffData?.map(({ id, domain, name }) => ({ id, domain, name })) })
