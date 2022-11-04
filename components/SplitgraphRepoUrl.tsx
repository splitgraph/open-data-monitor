import { useEffect } from 'react';
import useSplitgraphRepoUrl, { type SocrataDatasetID } from '../useSplitgraphRepoUrl';
import styles from '../styles/Spinner.module.css'

/** Headless component intended to redirect user to the corresponding 
 * Splitgraph repository. Depends on `socrataExternalRepositories` in GQL schema */
const SplitgraphRepoUrl = ({ id, domain, name }: SocrataDatasetID) => {
  const { url, error, isLoading } = useSplitgraphRepoUrl({ id, domain, name });
  useEffect(() => {
    if (url) {
      window.location.assign(url);
    }
  }, [url])
  if (isLoading) {
    return <span className={styles.loader} />
  }
  if (error) {
    return <span>Unable to fetch repo URL.</span>
  }

  return null;
}
export default SplitgraphRepoUrl