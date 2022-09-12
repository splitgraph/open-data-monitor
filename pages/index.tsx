import { useState, useEffect } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import Router, { useRouter, type NextRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { parse } from 'date-fns'
import styles from '../styles/Home.module.css'
import { HeadTag } from '../components/HeadTag'
import { DiffList } from '../components/Diffs'
import {
  unifiedFetcher, filterUseableTags, SocrataRepoTagsQuery,
} from '../data/index'
import SocfeedCalendar from '../components/Calendar'

import useTags from '../useTags'
import useDatasets from '../useDatasets'

type SocFeedDate = 'begin' | 'end';

const parseDate = (date: string) => {
  console.log({ date })
  if (date.length === 8) {
    return parse(date, 'yyyyMMdd', new Date())
  } else if (date.length === 15) {
    return parse(date, 'yyyyMMdd-HHmmss', new Date())
  }

  throw Error('unexpected date length, could not parse')
}

const initializeDates = (tags: string[], router: NextRouter) => {
  const sorted = tags.sort();
  const { begin, end } = router.query;
  if (begin && end && tags.includes(begin) && tags.includes(end)) {
    return;
  } else {
    const begin = sorted[0]
    const end = sorted[sorted.length - 1]

    const newQueryParams = {
      ...router.query,
      begin,
      end
    }
    router.replace({
      pathname: Router.pathname,
      query: newQueryParams,
    });
  }
}

const setDate = (whichDate: SocFeedDate, tag: string) => {
  const newQueryParameters = {
    ...Router.query,
    [whichDate]: tag
  }
  Router.replace({
    pathname: Router.pathname,
    query: newQueryParameters,
  });
}

const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
  const router = useRouter();
  const { begin, end } = router.query;
  const { tags, tagsError } = useTags();
  // useEffect(() => {
  //   if (tags?.length) {
  //     initializeDates(tags) // initialize (and validate) query params
  //   }
  // }, [tags])
  const { added, addedError, deleted, deletedError } = useDatasets({
    tags, begin: router.query.begin, end: router.query.end
  })

  return (
    <div className={styles.container}>
      <HeadTag />
      <SWRConfig value={{ fallback }}>
        <h2 className={styles.title}>SocFeed</h2>
        <h4 className={styles.description}>Discover interesting changes</h4>
        <button onClick={() => { initializeDates(tags, router) }}>click</button>
        <pre>{begin.toString()}</pre>
        <pre>{end.toString()}</pre>
        <main className={styles.main}>
          {tagsError && <h3>Unable to find tags</h3>}
          <div className={styles.calendars}>
            {!!tags?.length && !!begin && !!end &&
              <>
                <SocfeedCalendar
                  date={parseDate(begin)}
                  setDate={(date: string) => setDate('begin', date)}
                  tags={tags}
                />
                <SocfeedCalendar
                  date={parseDate(end)}
                  setDate={(date: string) => setDate('end', date)}
                  tags={tags}
                />
              </>
            }
          </div>
          <div style={{ textAlign: 'right' }}>
            {!!added?.length && <p><em>{added.length} results</em></p>}
          </div>
          <h4>Added</h4>
          <DiffList data={added} error={addedError} />
          <h4>Deleted</h4>
          {deletedError && <h3>Error querying deleted datasets</h3>}
          {pluckDDNSuccess(deleted)?.map(({ domain }, index) => <div key={index}>{domain}</div>)}
        </main>
      </SWRConfig>
      {/* <pre>
        {JSON.stringify(fallback, null, 2)}
      </pre> */}
      <footer className={styles.footer}>
        <a href="https://www.splitgraph.com" target="_blank" rel="noopener noreferrer">
          Powered by Splitgraph
        </a>
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
        [SocrataRepoTagsQuery]: filterUseableTags(nodes),
      }
    }
  }
}

export default Home

export const pluckDDNSuccess = (data: any) => data?.success ? [...data.rows] : [];