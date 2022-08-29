import { request, gql } from 'graphql-request'

const UNIFIED_GQL_API = 'https://api.splitgraph.com/gql/cloud/unified/graphql';
const DDN_API = 'https://data.splitgraph.com/sql/query/ddn';

interface Tag {
  tag: string;
}

export interface SocrataTagsGQL {
  tags: {
    nodes: Tag[]
  }
}

export const SocrataRepoTagsQuery = gql`
query SocrataRepoTags {
  tags(
    condition: { namespace: "splitgraph", repository: "socrata" }
    orderBy: _CREATED_AT_DESC
  ) {
    nodes {
      tag
    }
  }
}
`
export const unifiedFetcher = (query: string) => request(UNIFIED_GQL_API, query)

/**
 * I observed that "20220822" yields diffs but "20220822-180102"
 * does not. Thus filter for 'day' tags
 */
export const filterUseableTags = (nodes: Tag[]): string[] => {
  return nodes.map(({ tag }) => tag).filter((n: string) => n.length === 8)
}

/**
 * Return a SQL query that shows datasets added to Socrata in the time range
 * between the specified tags
 * 
 * Inspired by https://www.splitgraph.com/docs/query/time-travel-queries
 *
 * @param {string} oldTag the "old" tag
 * @param {string} newTag the "new" tag
 * @returns {string} SQL query intended for DDN
 */
export const getNewDatasetsQuery = (oldTag: string, newTag: string) => `
SELECT
  new.domain AS domain,
  new.id AS id,
  new.name AS name,
  new.description AS desc,
  new.updated_at,
  new.created_at,
  new.permalink
FROM
  "splitgraph/socrata:${oldTag}".datasets old
RIGHT JOIN
  "splitgraph/socrata:${newTag}".datasets new
ON
  old.id = new.id
WHERE
  old.id IS NOT DISTINCT FROM NULL
`

// export const getNewDatasetsQuery2 = (oldTag: string, newTag: string) => `
// SELECT 
//   DISTINCT(domain),
//   new.id AS id,
//   new.name AS name,
//   new.updated_at,
//   new.created_at
// FROM 
//   "splitgraph/socrata:${newTag}".datasets new
// WHERE 
//   domain NOT IN (SELECT DISTINCT(domain) 
//     FROM "splitgraph/socrata:${oldTag}".datasets)
// `

/**
 * Return a SQL query that shows datasets deleted from Socrata during the given
 * time range (i.e. between the specified tags)
 * 
 * Inspired by https://www.splitgraph.com/docs/query/time-travel-queries
 *
 * @param {string} oldTag the "old" tag
 * @param {string} newTag the "new" tag
 * @returns {string} SQL query intended for DDN
 */
export const getDeletedDatasetsQuery = (oldTag: string, newTag: string) => `
SELECT
    distinct old.domain AS domain
FROM
    "splitgraph/socrata:${oldTag}".datasets old
LEFT JOIN
    "splitgraph/socrata:${newTag}".datasets new
ON
    old.domain = new.domain
WHERE
  new.domain is null
`

export const ddnFetcher = (query: string) => fetch(DDN_API, {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    sql: query
  })
}).then((res) => res.json());

export const buildQuery = (rawTagsData: SocrataTagsGQL, leftIndex: number, rightIndex: number): string => {
  const tags = buildValues(rawTagsData);
  return getNewDatasetsQuery(tags[leftIndex], tags[rightIndex])
}

export const buildValues = (rawTagsData: SocrataTagsGQL | undefined): string[] => {
  return rawTagsData && filterUseableTags(rawTagsData?.tags?.nodes) || [];
}