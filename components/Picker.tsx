import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useMemo } from 'react';
import styles from './Picker.module.css'
import Button from './Button'
import { type RangeLength } from '../pages/index'
import { type TimestampDirection, Direction } from '../data/seafowl';

interface PickerProps {
  timestamp: string;
  setTimestamp: Dispatch<SetStateAction<string>>;
  data: Array<TimestampDirection> | undefined;
}
const Picker = ({ data, timestamp, setTimestamp }: PickerProps) => {
  const response = useMemo(() =>
    data ? Object.fromEntries(data.map(({ direction, timestamp }) => [direction, timestamp])) : {},
    [data]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => event.target.value;

  return (
    <div className={styles.root}>
      <Button
        onClick={() => setTimestamp(response.prev_day)}
        disabled={!(Direction.prev_day in response)}
      >← Previous</Button>
      <span className={styles.padding}>&nbsp;</span>
      <select className={styles.select}
        // disabled={disabled}
        // value={desiredRangeLength}
        onChange={handleChange}
      >
        <option value={1}>Day</option>
        <option value={7}>Week</option>
        <option value={30}>Month</option>
      </select>
      <span className={styles.padding}>&nbsp;</span>
      <Button
        onClick={() => setTimestamp(response.next_day)}
        disabled={!(Direction.next_day in response)}
      >Next →</Button>
    </div>
  )
}
export default Picker