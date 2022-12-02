import useImmutableSWR from 'swr/immutable';
import { seafowlFetcher, weeklyDiff, type DiffResponse } from './data/seafowl'

/** Fetch the provided timestamp's (week's) added & deleted datasets */
const useWeeklyDiff = (timestamp: string) => {
  const { data, error } = useImmutableSWR<Array<DiffResponse>>(weeklyDiff(timestamp), seafowlFetcher);

  return { data, error }
}

export default useWeeklyDiff;