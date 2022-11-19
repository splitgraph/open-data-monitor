import useMonthlyDiff from '../useMonthlyDiff';
import DatasetList from './DatasetList';

interface MonthlyDatasetListProps {
  timestamp: string;
}
const MonthlyDatasetList = ({ timestamp }: MonthlyDatasetListProps) => {
  const { data, error } = useMonthlyDiff(timestamp);
  return <DatasetList data={data} error={error} />
}


export default MonthlyDatasetList