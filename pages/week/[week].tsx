import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import type { SSRPageProps } from '..'
import { timestampAppendix } from '../../util'
import { seafowlFetcher, latestKnownWeek, picker, weeklyDiff } from '../../data/seafowl'
import RootLayout from '../../layouts/Root'
import WeeklyDatasetList from '../../components/WeeklyDatasetList'
import PickerContainer from '../../components/PickerContainer'

const WeekPage: NextPage<SSRPageProps> = ({ fallback }) => {
  const router = useRouter();
  const { week } = router.query;
  const weekTimestamp = `${week}${timestampAppendix}`;

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <SWRConfig value={{ fallback }}>
      <RootLayout>
        <PickerContainer timestamp={weekTimestamp} />
        <WeeklyDatasetList timestamp={weekTimestamp} />
      </RootLayout>
    </SWRConfig>
  )
}
WeekPage.getInitialProps = async ({ query }) => {
  const latestKnownWeekRaw = await seafowlFetcher(latestKnownWeek);
  const { latest } = latestKnownWeekRaw.length && latestKnownWeekRaw[0]
  console.log({ latest })

  // visiting `/week` uses 'latest known week'; visiting `/week/2022-12-01...` passes requested date in for hydration
  const timestamp = (query.week as string + timestampAppendix) || latest;
  console.log('week timestamp', timestamp)
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(weeklyDiff(timestamp))])

  return {
    fallback: {
      [latestKnownWeek]: timestamp,
      [picker(timestamp)]: responses[0],
      [weeklyDiff(timestamp)]: responses[1]
    }
  }
}

export default WeekPage