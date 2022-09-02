import { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import useSWR, { SWRConfig } from 'swr'
import styles from '../styles/Home.module.css'
import { HeadTag } from '../components/HeadTag'
import { DiffList } from '../components/Diffs'
import RangeSlider from '../components/RangeSlider';
import {
  unifiedFetcher, ddnFetcher, getNewDatasetsQuery,
  getDeletedDatasetsQuery,
  filterUseableTags, type SocrataTagsGQL, SocrataRepoTagsQuery,
  buildQuery, buildValues
} from '../data/index'

const Home: NextPage<{ fallback: any }> = ({ fallback }) => {
  const [rangeValues, setRangeValues] = useState([3, 6]);
  const { data: rawTagsData, error: tagsError } = useSWR<SocrataTagsGQL>(SocrataRepoTagsQuery, unifiedFetcher)
  const [tags, setTags] = useState<string[]>();
  const { data: newDatasetsData, error: diffError } = useSWR(rawTagsData
    ? buildQuery(rawTagsData, rangeValues[0], rangeValues[1])
    : null,
    ddnFetcher)

  useEffect(() => {
    setTags(buildValues(rawTagsData))
  }, [rawTagsData])

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
            {newDatasetsData && <p><em>{newDatasetsData.rowCount} results</em></p>}
          </div>
          <DiffList data={newDatasetsData} error={diffError} />
        </main>
      </SWRConfig>
      <footer className={styles.footer}>
        <a href="https://www.splitgraph.com" target="_blank" rel="noopener noreferrer">
          Powered by Splitgraph
        </a>
      </footer>
    </div >
  )
}

export async function getServerSideProps() {
  // get all tags
  const rawTagsData = await unifiedFetcher(SocrataRepoTagsQuery)

  // pluck `data.tags.nodes`
  const { tags: { nodes } } = rawTagsData;

  // I observed the SQL query diffs only certain tags - filter accordingly
  const useableTags = filterUseableTags(nodes);

  let query = '';
  if (nodes.length > 1) {
    query = getNewDatasetsQuery(useableTags[0], useableTags[1]);
  }

  const diffData = query && await ddnFetcher(query)

  return {
    props: {
      fallback: {
        [SocrataRepoTagsQuery]: useableTags,
        ...{ [query]: diffData }
      }
    }
  }
}

export default Home
