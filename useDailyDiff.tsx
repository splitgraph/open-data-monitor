import useSWR from 'swr';
import { seafowlFetcher, dailyDiff, type DailyDiffResponse } from './data/seafowl'

/** Fetch the provided timestamp's (day's) added & deleted datasets */
const useDailyDiff = (timestamp: string) => {
  const { data, error } = useSWR<Array<DailyDiffResponse>>(dailyDiff(timestamp), seafowlFetcher);

  return { data, error }
}

export default useDailyDiff;