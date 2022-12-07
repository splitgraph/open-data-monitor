import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig, unstable_serialize } from 'swr'
import type { SSRPageProps } from '..'
import { selectIdNameDomain, timestampAppendix } from '../../util'
import { seafowlFetcher, latestKnownMonth, picker, monthlyDiff } from '../../data/seafowl'
import { unifiedFetcher, SplitgraphURLBatch } from '../../data';
import RootLayout from '../../layouts/Root'
import MonthlyDatasetList from '../../components/MonthlyDatasetList'
import PickerContainer from '../../components/PickerContainer'

const MonthPage: NextPage<SSRPageProps> = ({ fallback }) => {
  const router = useRouter();
  const { month } = router.query;
  const monthTimestamp = `${month}${timestampAppendix}`;

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <SWRConfig value={{ fallback }}>
      <RootLayout>
        <PickerContainer timestamp={monthTimestamp} />
        <MonthlyDatasetList timestamp={monthTimestamp} />
      </RootLayout>
    </SWRConfig>
  )
}

MonthPage.getInitialProps = async ({ query }) => {
  const latestKnownMonthRaw = await seafowlFetcher(latestKnownMonth);
  const { latest } = latestKnownMonthRaw.length && latestKnownMonthRaw[0]
  const timestamp = (query.month as string + timestampAppendix) || latest;
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(monthlyDiff(timestamp))])
  const datasets = selectIdNameDomain(responses[1])
  const gqlResponse = await unifiedFetcher(SplitgraphURLBatch, datasets)

  return {
    fallback: {
      [latestKnownMonthRaw]: timestamp,
      [picker(timestamp)]: responses[0],
      [monthlyDiff(timestamp)]: responses[1],
      [unstable_serialize([SplitgraphURLBatch, datasets])]: gqlResponse
    }
  }
}

export default MonthPage