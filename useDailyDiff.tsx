import useImmutableSWR from 'swr/immutable';
import { seafowlFetcher, dailyDiff, type DiffResponse } from './data/seafowl'

/** Fetch the provided timestamp's (day's) added & deleted datasets */
const useDailyDiff = (timestamp: string) => {
  const { data, error } = useImmutableSWR<Array<DiffResponse>>(dailyDiff(timestamp), seafowlFetcher);

  return { data, error }
}

export default useDailyDiff;