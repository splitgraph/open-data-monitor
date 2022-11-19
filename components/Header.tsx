import Link from 'next/link'
import styles from '../layouts/Root.module.css'

const Header = () => {
  return (
    <header>
      <h2 className={styles.title}>
        <Link href="/">
          SocFeed
        </Link>
      </h2>
      <p className={styles.description}>Track added and deleted datasets on Socrata government data portals</p>
      <div className={styles.poweredBy}>
        Powered by <a href="https://www.splitgraph.com">Splitgraph</a>.
        <br /><br />
      </div>
    </header>
  )
}
export default Header