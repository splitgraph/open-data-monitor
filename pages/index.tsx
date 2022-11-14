import { useEffect, useCallback, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { unifiedFetcher, SocrataRepoTagsQuery, filterDates, SocrataTagsGQL } from '../data/index'
import useTags from '../useTags'
import useDatasets from '../useDatasets'
import styles from '../styles/Home.module.css'
import spinnerStyles from '../styles/Spinner.module.css'
import { HeadTag } from '../components/HeadTag'
import { dateifyTag } from '../components/DayPicker'
import DatasetList from '../components/DatasetList'
import Picker from '../components/Picker'
import Header from '../components/Header'
import Footer from '../components/Footer'

export type RangeLength = 1 | 7 | 30

const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
  console.log({ fallback })
  const router = useRouter();
  const { from, to } = router.query;
  const { tags, tagsError } = useTags();
  const { data, error } = useDatasets({ tags, from, to })
  const [desiredRangeLength, setDesiredRangeLength] = useState<RangeLength>(1);

  /** keep 'to', but try to change 'from' to 7 or 30 items less */
  const setRangeOrNextBest = (rangeLength: RangeLength) => {
    setDesiredRangeLength(rangeLength);
    if (typeof from !== 'string') {
      throw new Error('Invalid URL. Please ensure you have singleton query params')
    }
    if (from && to && tags && tags.length > 1) {
      const oldFromIndex = tags?.findIndex((value) => value === from)
      // const oldToIndex = tags?.findIndex((value) => value === to)
      if (oldFromIndex < 1) { return; }
      if (oldFromIndex > rangeLength) {
        const indexDiff = Math.min(rangeLength, oldFromIndex)
        const newQueryParams = {
          ...router.query,
          from: tags[oldFromIndex - indexDiff],
        }
        router.replace({
          pathname: router.pathname,
          query: newQueryParams,
        })
      }
    }
  }

  const showToday = useCallback(() => {
    if (!tags) {
      return;
    } else if (tags.length > 1) {
      const dateTags = filterDates(tags).sort()
      const from = dateTags.slice(-2, -1)[0]
      const to = dateTags.slice(-1)[0]
      const newQueryParams = {
        ...router.query,
        from: from,
        to: to
      }
      router.replace({
        pathname: router.pathname,
        query: newQueryParams,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags])

  /** We want to default to showing the most recent and most recent - 1 tags */
  useEffect(() => {
    if (!from && !to) {
      showToday();
    }
  }, [tags, showToday, from, to])

  const resetQueryParams = () => {
    router.replace(router.pathname, undefined, { shallow: true });
  }

  /** Given a date range, go back "minus one" tag.
   * This may not necessarily be a 24 hour period, rather just the previous array member.
   */
  const goPrevious = () => {
    if (typeof from !== 'string') {
      throw new Error('Invalid URL. Please ensure you have singleton query params')
    }
    if (from && to && tags && tags.length > 1) {
      const oldFromIndex = tags?.findIndex((value) => value === from)
      const oldToIndex = tags?.findIndex((value) => value === to)
      if (oldFromIndex > 0 && oldToIndex > 1) {
        const newQueryParams = {
          ...router.query,
          from: tags[oldFromIndex - 1],
          to: tags[oldToIndex - 1]
        }
        router.replace({
          pathname: router.pathname,
          query: newQueryParams,
        })
      }

    }
  }
  const goNext = () => {
    if (typeof from !== 'string') {
      throw new Error('Invalid URL. Please ensure you have singleton query params')
    }
    if (from && tags && tags.length > 1) {
      const oldFromIndex = tags?.findIndex((value) => value === from)
      const oldToIndex = tags?.findIndex((value) => value === to)
      if (oldFromIndex < tags.length - 2 && oldToIndex < tags.length - 1) {
        const newQueryParams = {
          ...router.query,
          from: tags[oldFromIndex + 1],
          to: tags[oldToIndex + 1]
        }
        router.replace({
          pathname: router.pathname,
          query: newQueryParams,
        })
      }
    }
  }

  return (
    <div className={styles.container}>
      <HeadTag />
      <SWRConfig value={{ fallback }}>
        <Header />
        <main className={styles.main}>
          {to && <h4 className={styles.centered}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', }).format(dateifyTag(to))}</h4>}
          <Picker
            goPrevious={goPrevious} goNext={goNext}
            disabled={!data && !error}
            desiredRangeLength={desiredRangeLength}
            setDesiredRangeLength={setRangeOrNextBest}
          />
          {tagsError && <h3>Error: unable to fetch tags</h3>}
          {!data && !error && <div className={styles.centerSpinner}> <div className={`${spinnerStyles.loader}`} /></div>}
          {
            data && <>
              <div style={{ textAlign: 'right' }}>
                {data?.success && <p><em>{data.rows.length} records</em></p>}
              </div>
              <div>
                {error && <h3>Error querying datasets</h3>}
                <DatasetList data={pluckDDNSuccess(data) || []} />
              </div>
            </>
          }
        </main>
      </SWRConfig>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // SSR fetch of all tags - always needed & independent of user-provided values
  const rawTagsData: SocrataTagsGQL = await unifiedFetcher(SocrataRepoTagsQuery)

  // pluck `data.tags.nodes`
  const { tags: { nodes } } = rawTagsData;

  return {
    props: {
      fallback: {
        [SocrataRepoTagsQuery]: nodes.map(({ tag }) => tag),
      }
    }
  }
}

export default Home

export const pluckDDNSuccess = (data: any) => data?.success ? [...data.rows] : [];