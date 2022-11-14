import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import styles from './Picker.module.css'
import Button from './Button'
import { type RangeLength } from '../pages/index'

interface PickerProps {
  goPrevious: () => void;
  goNext: () => void;
  disabled: boolean;
  desiredRangeLength: RangeLength;
  setDesiredRangeLength: (value: RangeLength) => void;
}
const Picker = ({ goPrevious, goNext, disabled, desiredRangeLength, setDesiredRangeLength }: PickerProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setDesiredRangeLength(+event.target.value as RangeLength)
  return (
    <div className={styles.root}>
      <Button onClick={goPrevious} disabled={disabled}>← Previous</Button>
      <span className={styles.padding}>&nbsp;</span>
      <select className={styles.select} disabled={disabled}
        value={desiredRangeLength}
        onChange={handleChange}
      >
        <option value={1}>Day</option>
        <option value={7}>Week</option>
        <option value={30}>Month</option>
      </select>
      <span className={styles.padding}>&nbsp;</span>
      <Button onClick={goNext} disabled={disabled}>Next →</Button>
    </div>
  )
}
export default Picker