import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router'
import styles from './Picker.module.css'
import selectStyles from './Select.module.css'
import Button from './Button'
import { type TimestampDirection, Direction } from '../data/seafowl';

interface PickerProps {
  timestamp: string;
  setTimestamp: (timestamp: string) => void;
  data: Array<TimestampDirection> | undefined;
}
const Picker = ({ data, timestamp, setTimestamp }: PickerProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false); // improve UX of Picker when an <option> is chosen
  const response = useMemo(() =>
    data ? Object.fromEntries(data.map(({ direction, timestamp }) => [direction, timestamp])) : {},
    [data]);

  //intended to tie the path (e.g. /, /week. /month) to <option>
  const dropdownIndex = router.pathname.split('/')[1] === '[index]' ? '' : router.pathname.split('/')[1];

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const { dataset } = event.target.options[event.target.selectedIndex];
    if (event.target.value.length) { // it's /week or /month
      router.push(`/${event.target.value}/${dataset['path']}`)
    }
    router.push(`/${dataset['path']}`) // when event.target.value === empty string, it's a day
  }

  const goPrev = () => {
    setIsLoading(true);
    switch (dropdownIndex) {
      case 'week':
        setTimestamp(response.prev_week);
        break;
      case 'month':
        setTimestamp(response.prev_month);
        break;
      default:  // day - either '/' or '/2022-10-24%20blahblah'
        setTimestamp(response.prev_day);
        break;
    }
    setIsLoading(false);
  }

  const goNext = () => {
    setIsLoading(true);
    switch (dropdownIndex) {
      case 'week':
        setTimestamp(response.next_week);
        break;
      case 'month':
        setTimestamp(response.next_month);
        break;
      default:  // day - either '/' or '/2022-10-24%20blahblah'
        setTimestamp(response.next_day);
        break;
    }
    setIsLoading(false);
  }

  const goToday = () => {
    router.push('/')
  }

  const prevDisabled = isLoading || dropdownIndex === ''
    ? !(Direction.prev_day in response)
    : dropdownIndex === 'week'
      ? !(Direction.prev_week in response)
      : !(Direction.prev_month in response)

  const nextDisabled = isLoading || dropdownIndex === ''
    ? !(Direction.next_day in response)
    : dropdownIndex === 'week'
      ? !(Direction.next_week in response)
      : !(Direction.next_month in response)

  return (
    <div className={styles.root}>
      <Button
        onClick={goPrev}
        disabled={prevDisabled}
      >← Previous</Button>
      <span className={styles.padding}>&nbsp;</span>
      <select className={selectStyles.select}
        value={dropdownIndex}
        disabled={isLoading}
        onChange={handleChange}
      >
        <option value={""} data-path={response[Direction.equivalent_day]}>Day</option>
        <option value={"week"} data-path={response[Direction.equivalent_week]}>Week</option>
        <option value={"month"} data-path={response[Direction.equivalent_month]}>Month</option>
      </select>
      <span className={styles.padding}>&nbsp;</span>
      <Button
        onClick={goNext}
        disabled={nextDisabled}
      >Next →</Button>
    </div>
  )
}
export default Picker