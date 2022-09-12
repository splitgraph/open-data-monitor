import useSWR from 'swr';
import { ddnFetcher, getAddedDatasetsQuery, getDeletedDatasetsQuery } from './data'

interface UseDatasetsParams {
  tags: string[] | undefined;
  begin: string | string[] | undefined;
  end: string | string[] | undefined;
}
/** Fetch added & deleted datasets */
const useDatasets = ({ tags, begin, end }: UseDatasetsParams) => {
  if (typeof begin === 'object' || typeof end === 'object') {
    throw Error('invalid query params')
  }
  const { data: added, error: addedError } = useSWR(
    (!!tags && !!begin && !!end)
      ? getAddedDatasetsQuery(begin, end)
      : null,
    ddnFetcher
  )
  const { data: deleted, error: deletedError } = useSWR(
    (!!tags && !!begin && !!end)
      ? getDeletedDatasetsQuery(begin, end)
      : null,
    ddnFetcher
  );

  return { added, addedError, deleted, deletedError }
}

export default useDatasets;