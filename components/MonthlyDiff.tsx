import Link from 'next/link';
import useSWR from 'swr'
import { seafowlFetcher, weeklyDiff } from '../data/seafowl';
import { type DatasetWithSplitgraphURL } from './DatasetList'

interface MonthlyDiffProps {
  timestamp: string;
}


const MonthlyDiff = ({ timestamp }: MonthlyDiffProps) => {
  const { data, error } = useSWR<Array<DatasetWithSplitgraphURL>>(weeklyDiff(timestamp), seafowlFetcher);

  return (
    <div>
      <h1>WeeklyDiff</h1>
      <h4>{timestamp}</h4>
      {data?.map(({ domain, id, name }) =>
        <div key={id}>
          <Link href={`/domain/${domain}`}>
            {domain}
          </Link>
        </div>)}
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

export default MonthlyDiff