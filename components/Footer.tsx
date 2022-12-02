import styles from '../layouts/Root.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="https://www.splitgraph.com" target="_blank" rel="noopener noreferrer">
        Powered by Splitgraph.
      </a>
      Questions? Tweet us <a href="https://twitter.com/intent/tweet?text=@splitgraph">@splitgraph</a>
    </footer>
  )
}
export default Footer