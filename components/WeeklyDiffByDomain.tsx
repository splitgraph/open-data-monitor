import Link from 'next/link';
import useSWR from 'swr'
import { seafowlFetcher, weeklyDiffByDomain, type AddedRemovedWeek } from '../data/seafowl';

interface WeeklyDiffByDomainProps {
  domain: string;
}

const WeeklyDiffByDomain = ({ domain }: WeeklyDiffByDomainProps) => {
  const { data, error } = useSWR<Array<AddedRemovedWeek>>(weeklyDiffByDomain(domain), seafowlFetcher);

  return (
    <div>
      <h1>WeeklyDiffByDomain</h1>
      <h4>{domain}</h4>
      {data?.map(({ week }) => <div key={week}>
        <Link href={`/week/${week}`}>
          {week}
        </Link>
      </div>)}
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

export default WeeklyDiffByDomain