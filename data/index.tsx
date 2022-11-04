import { request, gql } from 'graphql-request'

export const UNIFIED_GQL_API = 'https://api.splitgraph.com/gql/cloud/unified/graphql';
const DDN_API = 'https://data.splitgraph.com/sql/query/ddn';

export interface Tag {
  tag: string;
}

export interface SocrataTagsGQL {
  tags: {
    nodes: Tag[]
  }
}

/**
 * Fetch all available tags
 * 
 * Used to populate the UI (i.e. date picker) with only available dates.
 */
export const SocrataRepoTagsQuery = gql
  `query SocrataRepoTags {
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
export const SplitgraphURLQuery = gql
  `query getSocrataRepo($id: String!, $domain: String!, $name: String!) {
    socrataExternalRepositories (datasets: 
        [{id: $id, domain: $domain, name: $name}]) {
        namespace
        repository
    }
}
`

export const unifiedFetcher = (query: string) => request(UNIFIED_GQL_API, query)

/**
 * I observed that "20220822" yields diffs but "20220822-180102"
 * does not. Thus filter for 'day' tags
 */
export const filterDates = (tags: string[]): string[] => {
  return tags.filter((n: string) => n.length === 8)
}

/**
 * Return a SQL query that shows datasets added and deleted from Socrata during
 *  the given time range (i.e. between the specified tags)
 *
 * @param {string} oldTag the "old" tag
 * @param {string} newTag the "new" tag
 * @returns {string} SQL query intended for DDN
 */
export const getAddedDeletedDatasetsQuery = (oldTag: string, newTag: string) =>
  `WITH old AS MATERIALIZED(SELECT * FROM "splitgraph/socrata:${oldTag}".datasets),
  new AS MATERIALIZED(SELECT * FROM "splitgraph/socrata:${newTag}".datasets)
SELECT
  COALESCE(old.domain, new.domain) AS domain,
  COALESCE(old.id, new.id) AS id,
  COALESCE(old.name, new.name) AS name,
  COALESCE(old.description, new.description) AS description,
  COALESCE(old.created_at, new.created_at) AS created_at,
  COALESCE(old.updated_at, new.updated_at) AS updated_at,
  old.id IS NULL AS is_added   -- TRUE if added, FALSE if deleted
FROM old FULL OUTER JOIN new
ON old.domain = new.domain AND old.id = new.id
WHERE old.id IS NULL OR new.id IS NULL -- Only include added/deleted datasets
ORDER BY domain, name, is_added`

export const ddnFetcher = (query: string) => fetch(DDN_API, {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    sql: query
  })
}).then((res) => res.json());

export const buildValues = (rawTagsData: SocrataTagsGQL | undefined): string[] => {
  return rawTagsData && filterDates(rawTagsData?.tags?.nodes) || [];
}