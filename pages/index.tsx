import type { NextPage } from 'next'
import { SWRConfig, unstable_serialize } from 'swr'
import { seafowlFetcher, latestKnownWeek, picker, weeklyDiff } from '../data/seafowl'
import { unifiedFetcher, SplitgraphURLBatch } from '../data';
import { selectIdNameDomain } from '../util';
import RootLayout from '../layouts/Root'
import DailyDatasetList from '../components/DailyDatasetList'
import PickerContainer from '../components/PickerContainer'

/** SWR offers SSR support via a "fallback" prop, 
 * which contains the SSR-loaded data from Seafowl.
 * This hydrates the SWR cache and allows JS-disabled
 * users to still see content (for Googlebot/SEO)
 */
export interface SSRPageProps {
  fallback: any;
}
const Home: NextPage<SSRPageProps> = ({ fallback }) =>
  <SWRConfig value={{ fallback }}>
    <RootLayout>
      <PickerContainer timestamp={fallback[latestKnownWeek]} />
      <DailyDatasetList timestamp={fallback[latestKnownWeek]} />
    </RootLayout >
  </SWRConfig>

Home.getInitialProps = async () => {
  // avoid empty default by fetching "latest known day"
  const latestKnownWeekRaw = await seafowlFetcher(latestKnownWeek);
  // we need to parse out the value; assign it to `timestamp`
  const { latest: timestamp } = latestKnownWeekRaw.length && latestKnownWeekRaw[0]
  // fetch remaining two queries in parallel
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(weeklyDiff(timestamp))])
  // batch fetch Splitgraph URLs for each of the datasets
  const datasets = selectIdNameDomain(responses[1])
  const gqlResponse = await unifiedFetcher(SplitgraphURLBatch, datasets)

  return {
    fallback: {
      [latestKnownWeek]: timestamp,
      [picker(timestamp)]: responses[0],
      [weeklyDiff(timestamp)]: responses[1],
      [unstable_serialize([SplitgraphURLBatch, datasets])]: gqlResponse
    }
  }
}

export default Home