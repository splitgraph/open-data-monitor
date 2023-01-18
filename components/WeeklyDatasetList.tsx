import useWeeklyDiff from '../useWeeklyDiff';
import useSplitgraphRepoUrls from '../useSplitgraphRepoUrls';
import DatasetList from './DatasetList';

interface DailyDatasetListProps {
  timestamp: string;
}
const DailyDatasetList = ({ timestamp }: DailyDatasetListProps) => {
  const { data, error } = useWeeklyDiff(timestamp);
  const { dataWithSplitgraphURLs } = useSplitgraphRepoUrls(data);

  return <DatasetList data={dataWithSplitgraphURLs} error={error} timestamp={timestamp} />
}


export default DailyDatasetList