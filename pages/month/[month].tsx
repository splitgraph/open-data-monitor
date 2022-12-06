import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import type { SSRPageProps } from '..'
import { seafowlFetcher, latestKnownMonth, picker, monthlyDiff } from '../../data/seafowl'
import RootLayout from '../../layouts/Root'
import MonthlyDatasetList from '../../components/MonthlyDatasetList'
import PickerContainer from '../../components/PickerContainer'

const MonthPage: NextPage<SSRPageProps> = ({ fallback }) => {
  const router = useRouter();
  const { month } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const setTimestamp = (value: string) => {
    const newQueryParams = { ...router.query, month: value };

    router.replace({
      pathname: router.pathname,
      query: newQueryParams,
    });
  }

  return (
    <SWRConfig value={{ fallback }}>
      <RootLayout>
        <PickerContainer timestamp={month as string} setTimestamp={setTimestamp} />
        <MonthlyDatasetList timestamp={month as string} />
      </RootLayout>
    </SWRConfig>
  )
}

MonthPage.getInitialProps = async ({ query }) => {
  const latestKnownMonthRaw = await seafowlFetcher(latestKnownMonth);
  const { latest } = latestKnownMonthRaw.length && latestKnownMonthRaw[0]
  const timestamp = query.month as string || latest;
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(monthlyDiff(timestamp))])

  return {
    fallback: {
      [latestKnownMonthRaw]: timestamp,
      [picker(timestamp)]: responses[0],
      [monthlyDiff(timestamp)]: responses[1]
    }
  }
}

export default MonthPage