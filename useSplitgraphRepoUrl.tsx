import { useState, useEffect } from 'react';
import { request } from 'graphql-request'
import useSWR from 'swr';
import { SplitgraphURLQuery, UNIFIED_GQL_API } from './data'

/** Append namespace/repository to this URL */
const SPLITGRAPH_URL = 'https://www.splitgraph.com/'

const fetcher = (query: string, variables: any) => {
  return request(UNIFIED_GQL_API, query, variables)
}

interface ReturnedRepositories {
  socrataExternalRepositories: Array<Repository>;
}
interface Repository {
  namespace: string;
  repository: string;
}

export interface SocrataDatasetID {
  id: string;
  domain: string;
  name: string;
}

/** Returns a Splitgraph namespace + repository name for a given SocrataDatasetKey */
const useSplitgraphRepoUrl = ({ id, domain, name }: SocrataDatasetID) => {
  const { data, error } = useSWR<ReturnedRepositories>(
    [SplitgraphURLQuery, { id, domain, name }], fetcher)
  const [url, setUrl] = useState<string>();
  const isLoading = !error && !data;

  useEffect(() => {
    if (data && data.socrataExternalRepositories.length) {
      const namespace = data.socrataExternalRepositories[0].namespace;
      const repository = data.socrataExternalRepositories[0].repository;
      setUrl(`${SPLITGRAPH_URL}/${namespace}/${repository}`);
    }
  }, [data])

  return { url, error, isLoading }
}

export default useSplitgraphRepoUrl;