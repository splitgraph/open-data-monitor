import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import type { SSRPageProps } from './index';
import { timestampAppendix } from '../util'
import { seafowlFetcher, picker, dailyDiff } from '../data/seafowl'
import RootLayout from '../layouts/Root'
import DailyDatasetList from '../components/DailyDatasetList'
import PickerContainer from '../components/PickerContainer'

// Note: This file is called [index] but it really means a day.
// Visiting `/` should render 'latest known day', visiting `/blah` assumes blah is a day timestamp
const DayPage: NextPage<SSRPageProps> = ({ fallback }) => {
  const router = useRouter();


  return (
    <SWRConfig value={{ fallback }}>
      <RootLayout>
        <PickerContainer timestamp={fallback['timestamp']} />
        <DailyDatasetList timestamp={fallback['timestamp']} />
      </RootLayout >
    </SWRConfig>
  )
}

DayPage.getInitialProps = async ({ query }) => {
  /** so long as this code lives in [index].tsx, query.index should always be defined */
  const timestamp = query.index as string + timestampAppendix;
  const responses = await Promise.all([seafowlFetcher(picker(timestamp)), seafowlFetcher(dailyDiff(timestamp))])

  return {
    fallback: {
      timestamp: timestamp,
      [picker(timestamp)]: responses[0],
      [dailyDiff(timestamp)]: responses[1]
    }
  }
}

export default DayPage