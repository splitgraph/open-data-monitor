import styles from '../styles/Dataset.module.css'

interface DatasetProps {
  name: string,
  description: string,
  isAdded: boolean;
}
const Dataset = ({ name, description, isAdded }: DatasetProps) =>
  <div className={styles.dataset}
    style={{
      border: `1px solid ${isAdded ? 'green' : 'red'}`
    }}>
    <h6>{name}</h6>
    <p>{description}</p>
    {isAdded ? "added" : "deleted"}
  </div >

export default Dataset