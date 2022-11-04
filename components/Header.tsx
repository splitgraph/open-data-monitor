import styles from '../styles/Home.module.css'

const Header = () => {
  return (
    <header>
      <h2 className={styles.title}>SocFeed</h2>
      <p className={styles.description}>Track added and deleted datasets on Socrata government data portals</p>
      <div className={styles.poweredBy}>
        Powered by <a href="https://www.splitgraph.com">Splitgraph</a>.
        <br /><br />
      </div>
    </header>
  )
}
export default Header