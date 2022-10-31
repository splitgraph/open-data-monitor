import { useMemo } from 'react';
import Link from 'next/link'
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

type DatasetNoDomain = Omit<DatasetType, "domain">
interface RolledUpDatasets {
  [domain: string]: Array<DatasetNoDomain>;
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
              <a id={`${domain}`} key={domain} >
                <div className={styles.datasetAndDomain}>
                  <h3>{domain}</h3>
                  {
                    datasets.map(({ id, name, description, is_added }) =>
                      <Dataset key={name + id}
                        id={id} name={name} domain={domain}
                        description={description} isAdded={is_added}
                      />
                    )
                  }
                </div>
              </a>
            )
          }

          )
        }
      </div>
      <div className={styles.right}>
        <h4>Jump to...</h4>
        {Object.entries(rolledUp).map(([domain, datasets]) =>
          <div key={domain} className={styles.jumpToItem}>
            <a href={`#${domain}`}>
              {domain}
            </a>&nbsp;
            <AddsSubs addsSubs={getAddsSubs(datasets)} />
          </div>
        )}
        <p className={styles.jumpToFooter}>
          <Link href="/heatmap">Heatmap</Link>
        </p>
      </div>
    </div>
  )
}
export default DatasetList

const getAddsSubs = (datasets: Array<DatasetNoDomain>) => {
  let adds = 0;
  let subs = 0;
  datasets.forEach((ds: DatasetNoDomain) => {
    if (ds.is_added) { adds++ }
    else { subs++ }
  })

  return { adds, subs };
}

const AddsSubs = ({ addsSubs }: { addsSubs: { adds: number, subs: number } }) => {
  const { adds, subs } = addsSubs;
  return (
    <span>
      {adds > 0 && <Adds adds={adds} />}
      {((adds > 0) && (subs > 0)) && ", "}
      {subs > 0 && <Subs subs={subs} />}
    </span>
  )
}

const Adds = ({ adds }: { adds: number }) =>
  adds > 0 ? <span>{`+${adds}`}</span> : null

const Subs = ({ subs }: { subs: number }) =>
  subs > 0 ? <span>{`-${subs}`}</span> : null
