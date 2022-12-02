import useWeeklyDiff from '../useWeeklyDiff';
import DatasetList from './DatasetList';

interface DailyDatasetListProps {
  timestamp: string;
}
const DailyDatasetList = ({ timestamp }: DailyDatasetListProps) => {
  const { data, error } = useWeeklyDiff(timestamp);

  return <DatasetList data={data} error={error} />
}


export default DailyDatasetList