import { useEffect, useCallback, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { type DateRange } from 'react-day-picker'
import { unifiedFetcher, SocrataRepoTagsQuery, filterDates } from '../data/index'
import useTags from '../useTags'
import useDatasets from '../useDatasets'
import styles from '../styles/Home.module.css'
import { Popover } from '../components/Popover'
import { HeadTag } from '../components/HeadTag'
import RangePicker, { dateifyTag } from '../components/DayPicker'
import Button from '../components/Button'
import DatasetList from '../components/DatasetList'
import Picker from '../components/Picker'



const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
  const router = useRouter();
  const { from, to } = router.query;
  const { tags, tagsError } = useTags();
  const { data, error } = useDatasets({ tags, from, to })
  const [range, setRange] = useState<DateRange | undefined>();
  useEffect(() => {
    // if query params from/to exist, we should call setRange() so DayPicker's
    // initial date range matches the query params
    if (from && to) {
      setRange({
        from: dateifyTag(from),
        ...(to && { to: dateifyTag(to) })
      })
    }
  },
    // Empty array b/c we only want to sync once, at init time
    // eslint-disable-next-line
    [])

  const showToday = useCallback(() => {
    if (!tags) {
      return;
    } else if (tags.length > 1) {
      console.log('router.query', router.query)
      const dateTags = filterDates(tags).sort()
      const from = dateTags.slice(-2, -1)[0]
      const to = dateTags.slice(-1)[0]
      setRange({
        from: dateifyTag(from),
        ...(to && { to: dateifyTag(to) })
      })
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
  }, [tags])


  /** We want to default to showing the most recent and most recent - 1 tags */
  useEffect(() => {
    showToday();
  }, [tags, showToday])

  const resetQueryParams = () => {
    router.replace(router.pathname, undefined, { shallow: true });
  }
  console.log({ tags })

  const goPrevious = () => {
    if (from) {
      if (tags?.find(from)) { }
    }
  }

  return (
    <div className={styles.container}>
      <HeadTag />
      <SWRConfig value={{ fallback }}>
        <h2 className={styles.title}>SocFeed</h2>
        <p className={styles.description}>Track added and deleted datasets on Socrata government data portals</p>
        <div className={styles.poweredBy}>
          Powered by <a href="https://www.splitgraph.com">Splitgraph</a>.
          <br /><br />
        </div>
        <main className={styles.main}>
          {tagsError && <h3>Unable to find tags</h3>}
          {/*           
          <div className={styles.centered}>
            {!!tags?.length &&
              <>
                <Popover
                  render={({ close }) => (
                    <div style={{ background: 'gray', boxShadow: 'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px' }}>
                      <RangePicker tags={tags} range={range} setRange={setRange} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em' }}>
                        <Button onClick={() => {
                          const randOffsetOf10 = Math.floor(Math.random() * 10 + 1)
                          const filteredTags = filterDates(tags);
                          const from = dateifyTag(filteredTags[filteredTags.length - 1 - randOffsetOf10])
                          const to = dateifyTag(filteredTags[filteredTags.length - 1]);
                          setRange({ from, to })
                          close(from, to)
                        }}>🤷 Just choose something for me</Button>&nbsp;
                        <Button onClick={() => { close(range?.from, range?.to) }}>
                          ✅ Submit
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  <Button>✏️ Choose Dates</Button>
                </Popover>
                <>&nbsp;<Button onClick={resetQueryParams}>🗑 Reset</Button></>
              </>
            }
          </div>
          {
            !from && <h2 className={styles.centered}>
              <span className={styles.pulseWrapper}>
                <span className={styles.pulse}>👆</span>
              </span>
              Choose
            </h2>
          } */}
          {to && <h4 className={styles.centered}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', }).format(dateifyTag(to))}</h4>}
          <Picker goPrevious={() => { }} goNext={() => { }} />
          {
            data && <>
              <div style={{ textAlign: 'right' }}>
                {data?.success && <p><em>{data.rows.length} records</em></p>}
              </div>
              <div>
                {error && <h3>Error querying datasets</h3>}
                {data?.success && <DatasetList data={data.rows} />}
              </div>
            </>
          }
        </main >
      </SWRConfig >
      <footer className={styles.footer}>
        <a href="https://www.splitgraph.com" target="_blank" rel="noopener noreferrer">
          Powered by Splitgraph.
        </a>
        Questions? Tweet us <a href="https://twitter.com/intent/tweet?text=@splitgraph">@splitgraph</a>
      </footer>
    </div >
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // SSR fetch of all tags - always needed & independent of user-provided values
  const rawTagsData = await unifiedFetcher(SocrataRepoTagsQuery)

  // pluck `data.tags.nodes`
  const { tags: { nodes } } = rawTagsData;

  return {
    props: {
      fallback: {
        [SocrataRepoTagsQuery]: nodes,
      }
    }
  }
}

export default Home

export const pluckDDNSuccess = (data: any) => data?.success ? [...data.rows] : [];