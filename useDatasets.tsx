import useSWR from 'swr';
import { buildAddedDatasetsQuery, buildDeletedDatasetsQuery, ddnFetcher } from './data'

/** Fetch added & deleted datasets */
const useDatasets = (tags: string[] | undefined, rangeValues: number[]) => {
  const { data: added, error: addedError } = useSWR(tags
    ? buildAddedDatasetsQuery(tags, rangeValues[0], rangeValues[1])
    : null,
    ddnFetcher,
    // { revalidateOnMount: false } TODO: consider using this
  )
  const { data: deleted, error: deletedError } = useSWR(tags
    ? buildDeletedDatasetsQuery(tags, rangeValues[0], rangeValues[1])
    : null,
    ddnFetcher)



  return { added, addedError, deleted, deletedError }
}

export default useDatasets;