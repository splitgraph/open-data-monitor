import useSWR from 'swr';
import { ddnFetcher, getAddedDeletedDatasetsQuery } from './data'
import { type DatasetWithSplitgraphURL } from './components/DatasetList'

interface DDNResponse {
  success: string;
  rows: Array<DatasetWithSplitgraphURL>;
}

interface UseDatasetsParams {
  tags: string[] | undefined;
  from: string | string[] | undefined;
  to: string | string[] | undefined;
}
/** Fetch added & deleted datasets */
const useDatasets = ({ tags, from, to }: UseDatasetsParams) => {
  if (typeof from === 'object' || typeof to === 'object') {
    throw Error('invalid query params')
  }
  const { data, error } = useSWR<DDNResponse>(
    (!!tags && !!from && !!to)
      ? getAddedDeletedDatasetsQuery(from, to)
      : null,
    ddnFetcher
  );

  return { data, error }
}

export default useDatasets;