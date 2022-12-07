import useImmutableSWR from 'swr/immutable';
import { unifiedFetcher, SplitgraphURLBatch } from './data'
import { DiffResponse } from './data/seafowl';
import { selectIdNameDomain } from './util';

/** Append namespace/repository to this URL */
const SPLITGRAPH_URL = 'https://www.splitgraph.com'


interface ReturnedRepositories {
  socrataExternalRepositories: Array<Repository>;
}
interface Repository {
  namespace: string;
  repository: string;
}

/** Returns a Splitgraph namespace + repository name for a given SocrataDatasetKey */
const useSplitgraphRepoUrls = (diffData: DiffResponse[] | undefined) => {
  const datasets = selectIdNameDomain(diffData);
  const { data, error } = useImmutableSWR<ReturnedRepositories>([SplitgraphURLBatch, datasets], unifiedFetcher)
  let response;
  if (data) {
    const { socrataExternalRepositories } = data;
    response = diffData?.map((diffResponse, index) =>
    (
      {
        ...diffResponse,
        splitgraphURL: `${SPLITGRAPH_URL}/${socrataExternalRepositories[index]['namespace']}/${socrataExternalRepositories[index]['repository']}`
      }
    ))
  } else if (error) {
    console.warn('Unable to fetch repo URLs')
  }
  return { dataWithSplitgraphURLs: response, error };
}

export default useSplitgraphRepoUrls;