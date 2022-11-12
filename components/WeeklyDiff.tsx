import Link from 'next/link';
import useSWR from 'swr'
import { seafowlFetcher, weeklyDiff } from '../data/seafowl';
import { type DatasetType } from './DatasetList'

interface WeeklyDiffProps {
  timestamp: string;
}


const WeeklyDiff = ({ timestamp }: WeeklyDiffProps) => {
  const { data, error } = useSWR<Array<DatasetType>>(weeklyDiff(timestamp), seafowlFetcher);
  console.log({ data })

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

export default WeeklyDiff