import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { seafowlFetcher, latestKnownDay, picker, dailyDiff } from '../data/seafowl'
import RootLayout from '../layouts/Root'
import DailyDatasetList from '../components/DailyDatasetList'
import PickerContainer from '../components/PickerContainer'

// Note: This file is called [index] but it really means a day.
// Visiting `/` should render 'latest known day', visiting `/blah` assumes blah is a day timestamp
const DayPage: NextPage<{ fallback: any }> = ({ fallback }) => {
  const router = useRouter();
  // const [timestamp, setTimestamp] = useState(fallback['timestamp'])

  const setTimestamp = (value: string) => {
    const newQueryParams = { ...router.query, index: value };

    router.replace({
      pathname: router.pathname,
      query: newQueryParams,
    });
  }

  return (
    <SWRConfig value={{ fallback }}>
      <RootLayout>
        <PickerContainer timestamp={fallback['timestamp']} setTimestamp={setTimestamp} />
        <DailyDatasetList timestamp={fallback['timestamp']} />
      </RootLayout >
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  /** so long as this code lives in [index].tsx, query.index should always be defined */
  const timestamp = query.index as string;
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(dailyDiff(timestamp))])

  return {
    props: {
      fallback: {
        timestamp: timestamp,
        [picker(timestamp)]: responses[0],
        [dailyDiff(timestamp)]: responses[1]
      }
    }
  }
}

export default DayPage