import { type BareFetcher } from 'swr';
import { webcrypto } from 'crypto'
const SEAFOWL_API = 'https://socfeed-data.splitgraph.io/q'
const SEAFOWL_ROOT = 'https://socfeed-data.splitgraph.io'

/**
*  Datasets diffs between the specified tags (roughly, "dates")
 * @param from a tag provided by SocrataRepoTagsQuery (shouldn't be arbitrary)
 * @param to a subsequent tag provided by SocrataRepoTagsQuery (shouldn't be arbitrary)
 * @returns  Array<Dataset>, e.g. [{ domain, id, name, desc, created_at, updated_at, is_added }]
 * TODO probably needs to take four params
 */
export const fromToDiff = (from: string, to: string) =>
  `WITH 
  old AS(SELECT * FROM socrata.dataset_history WHERE sg_image_tag > '20221024' AND sg_image_tag < '20221025'),
  new AS(SELECT * FROM socrata.dataset_history WHERE sg_image_tag > '20221031' AND sg_image_tag < '20221101')
SELECT
  COALESCE(old.domain, new.domain) AS domain,
  COALESCE(old.id, new.id) AS id,
  COALESCE(old.name, new.name) AS name,
  COALESCE(old.description, new.description) AS description,
  COALESCE(old.created_at, new.created_at) AS created_at,
  COALESCE(old.updated_at, new.updated_at) AS updated_at,
  old.id IS NULL AS is_added
FROM old FULL OUTER JOIN new
ON old.domain = new.domain AND old.id = new.id
WHERE old.id IS NULL OR new.id IS NULL
ORDER BY domain, name, is_added`

/** 
 * Datasets added/deleted on the given day
 * 
 * @param timestamp should not include timezone e.g. 2022-11-02 00:00:00
 * @returns  Array<Dataset>, e.g. [{ domain, name, is_added, id, desc }]
 */
export const dailyDiff = (timestamp: string = '2022-11-02 00:00:00') =>
  `SELECT d.domain, d.name, is_added, dd.id, d.description, d.id
FROM socrata.daily_diff dd INNER JOIN socrata.all_datasets d
ON dd.id = d.id
WHERE dd.day::text = '${timestamp}'
ORDER BY 1, 3, 2`

export interface DiffResponse {
  domain: string;
  name: string;
  is_added: boolean;
  id: string;
  description: string;
}

/**
 * Datasets added/deleted as of the given date + 7 days
 * @param timestamp Data
 * @returns  Array<Dataset>, e.g. [{ domain, name, is_added, id, desc }]
 */
export const weeklyDiff = (timestamp: string = '2022-10-31 00:00:00') =>
  `SELECT d.domain, d.name, is_added, w.id, d.description, d.id
FROM socrata.weekly_diff w INNER JOIN socrata.all_datasets d
ON w.id = d.id
WHERE w.week::text = '${timestamp}'
ORDER BY 1, 3, 2`


export const weeklyDiffByDomain = (domain: string = 'data.cdc.gov') =>
  `SELECT
  wd.week,
  SUM(CASE WHEN wd.is_added THEN 1 ELSE 0 END) AS added,
  SUM(CASE WHEN wd.is_added THEN 0 ELSE 1 END) AS removed
FROM socrata.weekly_diff wd INNER JOIN socrata.all_datasets d
  ON wd.id = d.id
WHERE d.domain = '${domain}'
GROUP BY 1
ORDER BY 1 ASC`


export const weeklyDiffDomainTotals = (domain: string = 'data.cdc.gov') =>
  `SELECT
  wd.week,
  SUM(CASE WHEN wd.is_added THEN 1 ELSE 0 END) AS added,
  SUM(CASE WHEN wd.is_added THEN 0 ELSE 1 END) AS removed
FROM socrata.weekly_diff wd INNER JOIN socrata.all_datasets d
ON wd.id = d.id
WHERE d.domain = '${domain}'
GROUP BY 1
ORDER BY 1 ASC`

export const monthlyDiff = (timestamp: string) =>
  `SELECT month, d.domain, d.name, is_added, m.id, d.description, d.id
FROM socrata.monthly_diff m INNER JOIN socrata.all_datasets d
ON m.id = d.id
WHERE m.month::text = '${timestamp}'
ORDER BY 1, 2, 3`

export interface MonthlyDiffResponse extends DiffResponse {
  month: string;
}



export const heatmap = (domain: string = 'data.cdc.gov') =>
  `SELECT
DATE_TRUNC('day', sg_image_created) AS day,
COUNT(*) AS dataset_count
FROM socrata.dataset_history
WHERE domain = '${domain}'
GROUP BY 1
ORDER BY 1 ASC`


export const picker = (timestamp: string) =>
  `(SELECT
  day AS timestamp,
  'prev_day' AS direction
FROM socrata.daily_diff
  WHERE day < '${timestamp}'::timestamp
ORDER BY day DESC LIMIT 1)

UNION ALL

(SELECT
  day AS timestamp,
  'next_day' AS direction
FROM socrata.daily_diff
  WHERE day > '${timestamp}'::timestamp
ORDER BY day ASC LIMIT 1)

UNION ALL 

(SELECT
  day AS timestamp,
  'equivalent_day' AS direction
FROM socrata.daily_diff
  WHERE day <= '${timestamp}'::timestamp
ORDER BY day DESC LIMIT 1)

UNION ALL
  
  (SELECT
  week AS timestamp,
  'prev_week' AS direction
FROM socrata.weekly_diff
  WHERE week < '${timestamp}'::timestamp
ORDER BY week DESC LIMIT 1)

UNION ALL

(SELECT
  week AS timestamp,
  'next_week' AS direction
FROM socrata.weekly_diff
  WHERE week > '${timestamp}'::timestamp
ORDER BY week ASC LIMIT 1)

UNION ALL 

(SELECT
  week AS timestamp,
  'equivalent_week' AS direction
FROM socrata.weekly_diff
  WHERE week <= '${timestamp}'::timestamp
ORDER BY week DESC LIMIT 1)

UNION ALL 

(SELECT
  month AS timestamp,
  'prev_month' AS direction
FROM socrata.monthly_diff
  WHERE month < '${timestamp}'::timestamp
ORDER BY month DESC LIMIT 1)

UNION ALL

(SELECT
  month AS timestamp,
  'next_month' AS direction
FROM socrata.monthly_diff
  WHERE month > '${timestamp}'::timestamp
ORDER BY month ASC LIMIT 1)

UNION ALL 

(SELECT
  month AS timestamp,
  'equivalent_month' AS direction
FROM socrata.monthly_diff
  WHERE month <= '${timestamp}'::timestamp
ORDER BY month DESC LIMIT 1)`

/** Get the 'latest known day' day
 * Intended to more reliably give homepage content
 * Defaulting to the browser's "today" assumes the Seafowl instance was updated today,
 * which may not always be the case.
 */
export const latestKnownDay =
  `SELECT MAX(day) as latest FROM socrata.daily_diff`

/** Get the 'latest known week' i.e. Monday
*/
export const latestKnownWeek =
  `SELECT MAX(week) as latest FROM socrata.weekly_diff`

/** Get the 'latest known month' i.e. 9/1/2022 00:00:00
*/
export const latestKnownMonth =
  `SELECT MAX(month) as latest FROM socrata.monthly_diff`

export enum Direction {
  prev_day = "prev_day",
  next_day = "next_day",
  equivalent_day = "equivalent_day",
  prev_week = "prev_week",
  next_week = "next_week",
  equivalent_week = "equivalent_week",
  prev_month = "prev_month",
  next_month = "next_month",
  equivalent_month = "equivalent_month"
}

export interface TimestampDirection {
  direction: Direction;
  timestamp: string;
}

export interface AddedRemovedWeek {
  added: number;
  removed: number;
  week: string;
}
//@ts-ignore TODO figure out where we should import PublicConfiguration from
export const seafowlFetcher = (query: string): Partial<PublicConfiguration<AddedRemovedWeek[], any, BareFetcher<AddedRemovedWeek[]>>> =>
  fetch(SEAFOWL_API, {
    method: "POST",
    // TODO: https://seafowl.io/docs/guides/querying-cache-cdn#querying-from-the-browser-using-the-fetch-api - use GET
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query })
  }).then(async (response) => {
    const responseText = await response.text();
    return responseText ? responseText.trim().split("\n").map(JSON.parse as any) : [];
  }).catch((reason) => {
    console.error(reason)
  });


/** GET-based Seafowl fetcher
 * If you GET + pass a query hash in, Seafowl plays nice fetch()'s built-in cache semantics
 * Including the '.csv'hack which signals CloudFlare to use it's own caching
 * 
 * @see https://seafowl.io/docs/guides/querying-cache-cdn#querying-from-the-browser-using-the-fetch-api
 */
// @ts-ignore
export const seafowlFetcherCached = async (sql: string): Partial<PublicConfiguration<AddedRemovedWeek[], any, BareFetcher<AddedRemovedWeek[]>>> => {
  const query = sql.trim().replace(/(?:\r\n|\r|\n)/g, " ");

  /** Select appropriate crypto module, depending on SSR or CSR (Node.js vs browser)
   * window.crypto in-browser supports SubtleCrypto
   * for Node.js it lives inside crypto.webcrypto.subtle
   * Need to use the appropriate module depending on context
   */
  const theCrypto = typeof window === "undefined" ? webcrypto : crypto;

  const digest = await theCrypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(query)
  );
  const hash = [...new Uint8Array(digest)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");

  return fetch(`${SEAFOWL_ROOT}/q/${hash}.csv`, {
    headers: { "X-Seafowl-Query": query }
  }).then(async (response) => {
    const responseText = await response.text();
    console.log({responseText})
    return responseText ? responseText.trim().split("\n").map(JSON.parse as any) : [];
  }).catch((reason) => {
    console.error(reason)
  });
}


