import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig, unstable_serialize } from 'swr'
import type { SSRPageProps } from '..'
import { unifiedFetcher, SplitgraphURLBatch } from '../../data';
import { timestampAppendix, selectIdNameDomain } from '../../util'
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

  // visiting `/week` uses 'latest known week'; visiting `/week/2022-12-01...` passes requested date in for hydration
  const timestamp = (query.week as string + timestampAppendix) || latest.replace('T', ' ');
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(weeklyDiff(timestamp))])
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

export default WeekPage