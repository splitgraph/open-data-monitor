const SEAFOWL_API = 'https://seafowl-socrata.fly.dev/q'

/**
*  Datasets diffs between the specified tags (roughly, "dates")
 * @param from a tag provided by SocrataRepoTagsQuery (shouldn't be arbitrary)
 * @param to a subsequent tag provided by SocrataRepoTagsQuery (shouldn't be arbitrary)
 * @returns  Array<Dataset>, e.g. [{ domain, id, name, desc, created_at, updated_at, is_added }]
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
  `SELECT
  d.domain,
  d.name,
  is_added,
  id,  
  d.description
FROM socrata.daily_diff dd INNER JOIN socrata.all_datasets d
  ON dd.id = d.id
WHERE dd.day::text = '${timestamp}'
ORDER BY 1, 3, 2`

/**
 * Datasets added/deleted as of the given date + 7 days
 * @param timestamp Data
 * @returns  Array<Dataset>, e.g. [{ domain, name, is_added, id, desc }]
 */
export const weeklyDiff = (timestamp: string = '2022-10-31 00:00:00') =>
  `SELECT
  d.domain,
  d.name,
  is_added,
  id,  
  d.description
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


export const heatmap = (domain: string = 'data.cdc.gov') =>
  `SELECT
DATE_TRUNC('day', sg_image_created) AS day,
COUNT(*) AS dataset_count
FROM socrata.dataset_history
WHERE domain = '${domain}'
GROUP BY 1
ORDER BY 1 ASC`


export const seafowlFetcher = (query: string) => fetch(SEAFOWL_API, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ query })
}).then(async (response) => {
  const responseText = await response.text();
  return responseText ? responseText.trim().split("\n").map(JSON.parse as any) : [];
}).catch((reason) => {
  console.error(reason)
});