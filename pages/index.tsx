import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { seafowlFetcher, latestKnownDay, picker, dailyDiff } from '../data/seafowl'
import RootLayout from '../layouts/Root'
import DailyDatasetList from '../components/DailyDatasetList'
import PickerContainer from '../components/PickerContainer'

const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
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

export const getServerSideProps: GetServerSideProps = async () => {
  // avoid empty default by fetching "latest known day"
  const latestKnownDayRaw = await seafowlFetcher(latestKnownDay);
  // we need to parse out the value; assign it to `timestamp`
  const { latest: timestamp } = latestKnownDayRaw.length && latestKnownDayRaw[0]
  const pickerResult = await seafowlFetcher(picker(timestamp))
  const dailyDiffResult = await seafowlFetcher(dailyDiff(timestamp))

  return {
    props: {
      fallback: {
        [latestKnownDay]: timestamp,
        [picker(timestamp)]: pickerResult,
        [dailyDiff(timestamp)]: dailyDiffResult
      }
    }
  }
}

export default Home