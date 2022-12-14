import useMonthlyDiff from '../useMonthlyDiff';
import useSplitgraphRepoUrls from '../useSplitgraphRepoUrls';
import DatasetList from './DatasetList';

interface MonthlyDatasetListProps {
  timestamp: string;
}
const MonthlyDatasetList = ({ timestamp }: MonthlyDatasetListProps) => {
  const { data, error } = useMonthlyDiff(timestamp);
  const { dataWithSplitgraphURLs } = useSplitgraphRepoUrls(data);

  return <DatasetList data={dataWithSplitgraphURLs} error={error} />
}


export default MonthlyDatasetList