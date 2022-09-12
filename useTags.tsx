import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { buildValues, type SocrataTagsGQL, SocrataRepoTagsQuery, unifiedFetcher } from './data'

/** Fetch all Socrata tags via Unified GQL API */
const useTags = () => {
  const { data: tagsData, error: tagsError } = useSWR<SocrataTagsGQL>(SocrataRepoTagsQuery, unifiedFetcher,
  )
  const [tags, setTags] = useState<string[]>();

  useEffect(() => {
    setTags(buildValues(tagsData))
  }, [tagsData])
  console.log({ tags })


  return { tags, tagsError }
}

export default useTags;