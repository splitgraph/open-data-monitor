import { useMemo } from 'react';
import { useRouter } from 'next/router'
import Dataset from './Dataset';
import styles from './Dataset.module.css';
import spinnerStyles from './Spinner.module.css'
import { type DiffResponse } from '../data/seafowl'
import DatasetJumpTo from './DatasetJumpTo';
import { ExternalLinkIcon } from './ExternalLinkIcon';

export interface DatasetWithSplitgraphURL extends DiffResponse {
  splitgraphURL: string;
}

export type DatasetNoDomain = Omit<DatasetWithSplitgraphURL, "domain">
export interface RolledUpDatasets {
  [domain: string]: Array<DatasetNoDomain>;
}

const rollupData = (rows: Array<DiffResponse>): RolledUpDatasets => {
  let result: any = {};
  if (rows) {
    rows?.forEach(({ domain, ...rest }) => {
      if (!result[domain]) {
        result[domain] = []
      }
      result[domain].push({ ...rest })
    })
  }
  return result
}

interface DatasetListProps {
  data: any;
  error: any;
  timestamp: string;
}
const DatasetList = ({ data, error, timestamp }: DatasetListProps) => {
  const router = useRouter()
  const selectedTimeUnit = router.pathname === '/' ? 'week' : router.pathname.split('/')[1] === '[index]' ? 'day' : router.pathname.split('/')[1];
  const rolledUp: RolledUpDatasets = useMemo(() => rollupData(data as any), [data]);

  return (
    <div>
      <div className={styles.jumpToSelect}>
        Jump to:&nbsp;<DatasetJumpTo rolledUp={rolledUp} showSelect />
      </div>
      {data &&
        <div>
          {data.length} dataset{data.length > 1 ? 's' : ''} added/removed&nbsp;
          {selectedTimeUnit === 'day' ? `${selectedTimeUnit} of` : `${selectedTimeUnit} starting`}&nbsp;
          {new Date(timestamp?.slice(0, 10)).toLocaleDateString("en", { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
        </div>
      }
      <div className={styles.datasetsList}>
        {error && <h3>Error querying datasets</h3>}

        {!data && !error && <div className={styles.centerSpinner}> <div className={`${spinnerStyles.loader}`} /></div>}
        <div className={styles.left}>
          {
            Object.entries(rolledUp).map(([domain, datasets]) => {
              return (
                <div key={domain} className={styles.datasetAndDomain}>
                  <a id={`${domain}`} key={domain} style={{ display: 'hidden' }}>&nbsp;</a>
                  <h3><a href={`http://${domain}`}>{domain}</a> <ExternalLinkIcon /></h3>
                  <>
                    {
                      datasets.map(({ id, name, description, is_added, splitgraphURL }) =>
                        <Dataset key={name + id}
                          id={id} name={name} domain={domain}
                          description={description} is_added={is_added}
                          splitgraphURL={splitgraphURL}
                        />
                      )
                    }
                  </>
                </div>
              )
            }
            )
          }
        </div>
        <div className={styles.right}>
          <DatasetJumpTo rolledUp={rolledUp} />
        </div>

      </div>
    </div>
  )
}
export default DatasetList
