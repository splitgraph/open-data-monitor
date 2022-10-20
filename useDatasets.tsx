import useSWR from 'swr';
import { ddnFetcher, getAddedDatasetsQuery, getDeletedDatasetsQuery } from './data'
import { type Tag } from './data'

interface UseDatasetsParams {
  tags: Tag[] | undefined;
  from: string | string[] | undefined;
  to: string | string[] | undefined;
}
/** Fetch added & deleted datasets */
const useDatasets = ({ tags, from, to }: UseDatasetsParams) => {
  if (typeof from === 'object' || typeof to === 'object') {
    throw Error('invalid query params')
  }
  const { data: added, error: addedError, } = useSWR(
    (!!tags && !!from && !!to)
      ? getAddedDatasetsQuery(from, to)
      : null,
    ddnFetcher
  )
  const { data: deleted, error: deletedError } = useSWR(
    (!!tags && !!from && !!to)
      ? getDeletedDatasetsQuery(from, to)
      : null,
    ddnFetcher
  );

  return { added, addedError, deleted, deletedError }
}

export default useDatasets;