import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { seafowlFetcher, latestKnownDay, picker, dailyDiff } from '../data/seafowl'
import styles from '../styles/Home.module.css'
import spinnerStyles from '../styles/Spinner.module.css'
import { HeadTag } from '../components/HeadTag'
import DatasetList from '../components/DatasetList'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PickerContainer from '../components/PickerContainer'
import useDailyDiff from '../useDailyDiff'

export type RangeLength = 1 | 7 | 30

const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
  const router = useRouter();
  const [timestamp, setTimestamp] = useState(fallback[latestKnownDay])
  const { data, error } = useDailyDiff(timestamp);

  const resetQueryParams = () => {
    router.replace(router.pathname, undefined, { shallow: true });
  }

  return (
    <div className={styles.container}>
      <HeadTag />
      <SWRConfig value={{ fallback }}>
        <Header />
        <main className={styles.main}>
          <PickerContainer timestamp={timestamp} setTimestamp={setTimestamp} />
          {!data && !error && <div className={styles.centerSpinner}> <div className={`${spinnerStyles.loader}`} /></div>}
          {
            data && <>
              <div style={{ textAlign: 'right' }}>
                {data.length && <p><em>{data.length} records</em></p>}
              </div>
              <div>
                {error && <h3>Error querying datasets</h3>}
                <DatasetList data={data || []} />
              </div>
            </>
          }
        </main>
      </SWRConfig>
      <Footer />
    </div>
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