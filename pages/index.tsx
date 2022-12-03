import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { seafowlFetcher, latestKnownDay, picker, dailyDiff } from '../data/seafowl'
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
const Home: NextPage<SSRPageProps> = ({ fallback }) => {
  const router = useRouter();

  const setTimestamp = (value: string) => {
    router.replace({
      pathname: `/${value}`,
    });
  }

  return (
    <SWRConfig value={{ fallback }}>
      <RootLayout>
        <PickerContainer timestamp={fallback[latestKnownDay]} setTimestamp={setTimestamp} />
        <DailyDatasetList timestamp={fallback[latestKnownDay]} />
      </RootLayout >
    </SWRConfig>
  )
}

Home.getInitialProps = async () => {
  // avoid empty default by fetching "latest known day"
  const latestKnownDayRaw = await seafowlFetcher(latestKnownDay);
  // we need to parse out the value; assign it to `timestamp`
  const { latest: timestamp } = latestKnownDayRaw.length && latestKnownDayRaw[0]
  // fetch remaining two queries in parallel
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(dailyDiff(timestamp))])

  return {
    fallback: {
      [latestKnownDay]: timestamp,
      [picker(timestamp)]: responses[0],
      [dailyDiff(timestamp)]: responses[1]
    }
  }
}

export default Home