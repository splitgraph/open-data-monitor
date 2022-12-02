import useDailyDiff from '../useDailyDiff';
import DatasetList from './DatasetList';

interface DailyDatasetListProps {
  timestamp: string;
}
const DailyDatasetList = ({ timestamp }: DailyDatasetListProps) => {
  const { data, error } = useDailyDiff(timestamp);
  return <DatasetList data={data} error={error} />
}


export default DailyDatasetList