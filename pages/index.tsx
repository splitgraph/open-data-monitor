import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import styles from '../styles/Home.module.css'
import { HeadTag } from '../components/HeadTag'
import { DiffList } from '../components/Diffs'
import RangeSlider from '../components/RangeSlider';
import {
  unifiedFetcher, ddnFetcher, getAddedDatasetsQuery, getDeletedDatasetsQuery,
  filterUseableTags, SocrataRepoTagsQuery,
} from '../data/index'

import useTags from '../useTags'
import useDatasets from '../useDatasets'

const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
  const { query: { begin, end }, replace } = useRouter();
  const [rangeValues, setRangeValues] = useState([3, 6]);
  const { tags, tagsError } = useTags();
  const { added, addedError, deleted, deletedError } = useDatasets(tags, rangeValues)

  return (
    <div className={styles.container}>
      <HeadTag />
      <SWRConfig value={{ fallback }}>
        <h2 className={styles.title}>SocFeed</h2>
        <main className={styles.main}>
          {tagsError && <h3>Unable to find tags</h3>}
          {!!tags?.length &&
            <RangeSlider values={rangeValues} setValues={setRangeValues}
              tags={tags} min={Number(tags[tags.length - 1])} max={Number(tags[0])}
              className={styles.rangeSlider}
            />
          }
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
  const { begin, end } = query;
  const strBegin = typeof begin === 'string' ? begin : begin?.join('');
  const strEnd = typeof end === 'string' ? end : end?.join('');

  // get all tags
  const rawTagsData = await unifiedFetcher(SocrataRepoTagsQuery)

  // pluck `data.tags.nodes`
  const { tags: { nodes } } = rawTagsData;

  // I observed the SQL query diffs only certain tags - filter accordingly
  const useableTags = filterUseableTags(nodes);

  let addedDatasetsQuery = '';
  let deletedDatasetsQuery = '';
  if (nodes.length > 1) {
    addedDatasetsQuery = getAddedDatasetsQuery(strBegin || useableTags[0], strEnd || useableTags[1]);
    deletedDatasetsQuery = getDeletedDatasetsQuery(strBegin || useableTags[0], strEnd || useableTags[1]);
  }

  const addedDatasets = addedDatasetsQuery && await ddnFetcher(addedDatasetsQuery)
  const deletedDatasets = deletedDatasetsQuery && await ddnFetcher(deletedDatasetsQuery)

  return {
    props: {
      fallback: {
        [SocrataRepoTagsQuery]: useableTags,
        ...{ [addedDatasetsQuery]: addedDatasets },
        ...{ [deletedDatasetsQuery]: deletedDatasets }
      }
    }
  }
}

export default Home


export const pluckDDNSuccess = (data: any) => data?.success ? [...data.rows] : [];