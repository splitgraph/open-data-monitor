import useDailyDiff from '../useDailyDiff';
import useSplitgraphRepoUrls from '../useSplitgraphRepoUrls';
import DatasetList from './DatasetList';

interface DailyDatasetListProps {
  timestamp: string;
}
const DailyDatasetList = ({ timestamp }: DailyDatasetListProps) => {
  const { data, error } = useDailyDiff(timestamp);
  /** Batch requests (GQL) for Splitgraph URLs for all provided datasets
   * @returns the same datasets, but injected with their individual splitgraphURL
   */
  const { dataWithSplitgraphURLs } = useSplitgraphRepoUrls(data);

  return <DatasetList data={dataWithSplitgraphURLs} error={error} timestamp={timestamp} />
}


export default DailyDatasetList