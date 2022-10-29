import { useMemo } from 'react';
import Dataset from './Dataset';
import styles from '../styles/Dataset.module.css';

export interface DatasetType {
  domain: string;
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_added: boolean;
}

interface RolledUpDatasets {
  [domain: string]: Array<Omit<DatasetType, "domain">>;
}

const rollupData = (rows: Array<DatasetType>): RolledUpDatasets => {
  let result: any = {};
  if (rows) {
    console.log({ rows })
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
  data: Array<DatasetType>;
}
const DatasetList = ({ data }: DatasetListProps) => {
  const rolledUp: RolledUpDatasets = useMemo(() => rollupData(data), [data]);

  return (
    <div className={styles.datasetsList}>
      <div className={styles.left}>
        {
          Object.entries(rolledUp).map(([domain, datasets]) => {
            return (
              <div key={domain}>

                <h4><a id={`${domain}`}>{domain}</a></h4>
                {
                  datasets.map(({ name, description, is_added }) =>
                    <Dataset key={name} name={name} description={description} isAdded={is_added} />
                  )
                }

              </div>

            )
          }

          )
        }
      </div>
      <div className={styles.right}>
        {Object.keys(rolledUp).map((domain) => <div key={domain}><a href={`#${domain}`}>{domain}</a></div>)}
      </div>
    </div>
  )
}
export default DatasetList
