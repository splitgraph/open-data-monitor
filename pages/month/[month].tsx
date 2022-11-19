import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { seafowlFetcher, latestKnownMonth, picker, monthlyDiff } from '../../data/seafowl'
import RootLayout from '../../layouts/Root'
import MonthlyDatasetList from '../../components/MonthlyDatasetList'
import PickerContainer from '../../components/PickerContainer'

const MonthPage: NextPage<{ fallback: any }> = ({ fallback }) => {
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
export const getServerSideProps: GetServerSideProps = async () => {
  const latestKnownMonthRaw = await seafowlFetcher(latestKnownMonth);
  const { latest: timestamp } = latestKnownMonthRaw.length && latestKnownMonthRaw[0]
  const pickerResult = await seafowlFetcher(picker(timestamp))
  const dailyDiffResult = await seafowlFetcher(monthlyDiff(timestamp))

  return {
    props: {
      fallback: {
        [latestKnownMonthRaw]: timestamp,
        [picker(timestamp)]: pickerResult,
        [monthlyDiff(timestamp)]: dailyDiffResult
      }
    }
  }
}

export default MonthPage