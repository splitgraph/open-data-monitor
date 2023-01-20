import Link from 'next/link'
import styles from '../layouts/Root.module.css'

const Header = () => {
  return (
    <header>
      <h2 className={styles.title}>
        <Link href="/">
          Open Data Monitor
        </Link>
      </h2>
      <p className={styles.description}>Monitor added/deleted datasets on <a href="https://dev.socrata.com/">Socrata</a> open government data portals</p>
      <div className={styles.poweredBy}>
        Powered by <a href="https://www.splitgraph.com" target="_new">Splitgraph</a>, Built with <a href="https://www.seafowl.io" target="_new">Seafowl</a>
        <br /><br />
      </div>
    </header>
  )
}
export default Header