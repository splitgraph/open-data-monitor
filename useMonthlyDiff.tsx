import useImmutableSWR from 'swr/immutable';
import { seafowlFetcher, monthlyDiff, type DiffResponse } from './data/seafowl'

/** Fetch the provided timestamp's (week's) added & deleted datasets */
const useMonthlyDiff = (timestamp: string) => {
  const { data, error } = useImmutableSWR<Array<DiffResponse>>(monthlyDiff(timestamp), seafowlFetcher);

  return { data, error }
}

export default useMonthlyDiff;