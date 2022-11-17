import useSWR from 'swr';
import { seafowlFetcher, dailyDiff, type DailyDiffResponse } from './data/seafowl'


/** Fetch the provided timestamp's added & deleted datasets (by day) */
const useDailyDiff = (timestamp: string) => {
  const { data, error } = useSWR<Array<DailyDiffResponse>>(
    timestamp
      ? dailyDiff(timestamp)
      : null,
    seafowlFetcher
  );

  return { data, error }
}

export default useDailyDiff;