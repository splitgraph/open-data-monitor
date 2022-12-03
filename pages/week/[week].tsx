import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { seafowlFetcher, latestKnownWeek, picker, weeklyDiff } from '../../data/seafowl'
import RootLayout from '../../layouts/Root'
import WeeklyDatasetList from '../../components/WeeklyDatasetList'
import PickerContainer from '../../components/PickerContainer'
import { SSRPageProps } from '..'

const WeekPage: NextPage<SSRPageProps> = ({ fallback }) => {
  const router = useRouter();
  const { week } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const setTimestamp = (value: string) => {
    const newQueryParams = { ...router.query, week: value };

    router.replace({
      pathname: router.pathname,
      query: newQueryParams,
    });
  }

  return (
    <SWRConfig value={{ fallback }}>
      <RootLayout>
        <PickerContainer timestamp={week as string} setTimestamp={setTimestamp} />
        <WeeklyDatasetList timestamp={week as string} />
      </RootLayout>
    </SWRConfig>
  )
}
WeekPage.getInitialProps = async () => {
  const latestKnownWeekRaw = await seafowlFetcher(latestKnownWeek);
  const { latest: timestamp } = latestKnownWeekRaw.length && latestKnownWeekRaw[0]
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