import useImmutableSWR from 'swr/immutable';
import { seafowlFetcher, dailyDiff, type DailyDiffResponse } from './data/seafowl'

/** Fetch the provided timestamp's (day's) added & deleted datasets */
const useDailyDiff = (timestamp: string) => {
  const { data, error } = useImmutableSWR<Array<DailyDiffResponse>>(dailyDiff(timestamp), seafowlFetcher);

  return { data, error }
}

export default useDailyDiff;