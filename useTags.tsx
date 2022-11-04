import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  type SocrataTagsGQL, type Tag,
  SocrataRepoTagsQuery, unifiedFetcher
} from './data'

/** Fetch all Socrata tags via Unified GQL API */
const useTags = () => {
  const { data: tagsData, error: tagsError } = useSWR<SocrataTagsGQL>(SocrataRepoTagsQuery, unifiedFetcher)
  const [tags, setTags] = useState<string[]>();

  useEffect(() => {
    if (tagsData) {
      console.log({ tagsData })
      setTags(tagsData.tags.nodes.map(({ tag }) => tag).sort())
      console.log({ tags })
    }
  }, [tagsData])

  return { tags, tagsError }
}

export default useTags;