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
    return (
      <div className={styles.loader}></div>)
  }
  if (error) {
    return <div>Unable to fetch repo URL.</div>
  }

  return null;
}
export default SplitgraphRepoUrl