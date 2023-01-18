import Image from 'next/image'
import styles from '../layouts/Root.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="https://gitlab.com/splitgraph/socfeed/" target="_new">Code</a><br />
      Feeling lucky? <a href="https://splitgraph.github.io/socrata-roulette/">Socrata Roulette</a><br />
      <br />
      <Image src="/brandmark.svg" alt="Splitgraph logo" width="35" height="35" /><br />
      <a href="https://www.splitgraph.com" target="_blank" rel="noopener noreferrer">
        Powered by Splitgraph
      </a>
      <div>
        Questions? Tweet us <a href="https://twitter.com/intent/tweet?text=@splitgraph">@splitgraph</a>
      </div>
    </footer>
  )
}
export default Footer