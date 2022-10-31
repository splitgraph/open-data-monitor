import styles from './Picker.module.css'
import Button from './Button'

const Picker = () => {
  return (
    <div className={styles.root}>
      <Button>← Previous</Button>
      <span className={styles.padding}>&nbsp;</span>
      <select className={styles.select}>
        <option>Day</option>
        <option>Week</option>
        <option>Month</option>
      </select>
      <span className={styles.padding}>&nbsp;</span>
      <Button >Next →</Button>
    </div>
  )
}
export default Picker