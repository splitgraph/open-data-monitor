import styles from './Picker.module.css'
import Button from './Button'

interface PickerProps {
  goPrevious: () => void;
  goNext: () => void;
}
const Picker = ({ goPrevious, goNext }: PickerProps) => {
  return (
    <div className={styles.root}>
      <Button onClick={goPrevious}>← Previous</Button>
      <span className={styles.padding}>&nbsp;</span>
      <select className={styles.select}>
        <option>Day</option>
        <option>Week</option>
        <option>Month</option>
      </select>
      <span className={styles.padding}>&nbsp;</span>
      <Button onClick={goNext}>Next →</Button>
    </div>
  )
}
export default Picker