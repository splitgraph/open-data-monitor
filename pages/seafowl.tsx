import useSWR from "swr"
import { seafowlFetcher, fromToDiff, dailyDiff, weeklyDiff, weeklyDiffByDomain, weeklyDiffDomainTotals, heatmap } from "../data/seafowl";

const FromToDiff = () => {
  const { data, error } = useSWR(fromToDiff, seafowlFetcher);

  return (
    <div style={{ width: '400px', overflow: 'hidden' }}>
      <h1>FromToDiff</h1>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

const DailyDiff = () => {
  const { data, error } = useSWR(dailyDiff, seafowlFetcher);

  return (
    <div style={{ width: '400px', overflow: 'hidden' }}>
      <h1>DailyDiff</h1>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}


const WeeklyDiff = () => {
  const { data, error } = useSWR(weeklyDiff, seafowlFetcher);

  return (
    <div style={{ width: '400px', overflow: 'hidden' }}>
      <h1>WeeklyDiff</h1>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

const WeeklyDiffByDomain = () => {
  const domain = 'data.cdc.gov';
  const { data, error } = useSWR(weeklyDiffByDomain(domain), seafowlFetcher);

  return (
    <div style={{ width: '400px', overflow: 'hidden' }}>
      <h1>WeeklyDiffByDomain</h1>
      <h4>{domain}</h4>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

const WeeklyDiffDomainTotals = () => {
  const domain = 'data.cdc.gov';
  const { data, error } = useSWR(weeklyDiffDomainTotals(domain), seafowlFetcher);

  return (
    <div style={{ width: '450px', overflow: 'hidden' }}>
      <h1>WeeklyDiffDomainTotals</h1>
      <h4>{domain}</h4>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
const Heatmap = () => {
  const domain = 'data.cdc.gov';
  const { data, error } = useSWR(heatmap(domain), seafowlFetcher);

  return (
    <div style={{ width: '400px', overflow: 'hidden' }}>
      <h1>Heatmap</h1>
      <h4>{domain}</h4>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

const Page = () => {
  return (
    <div style={{ display: 'flex' }}>
      <FromToDiff />
      <DailyDiff />
      <WeeklyDiff />
      <WeeklyDiffByDomain />
      <WeeklyDiffDomainTotals />
      <Heatmap />
    </div>
  )
}
export default Page
