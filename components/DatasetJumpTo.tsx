import Link from 'next/link'
import type { RolledUpDatasets, DatasetNoDomain } from './DatasetList';
import styles from './Dataset.module.css';
import selectStyles from './Select.module.css';

interface DatasetJumpToProps {
  rolledUp: RolledUpDatasets;
  showSelect?: boolean;
}

const DatasetJumpTo = ({ rolledUp, showSelect }: DatasetJumpToProps) => {
  return (
    <div>
      {showSelect
        ?
        <select className={selectStyles.select} onChange={(event) => {
          const { dataset } = event.target.options[event.target.selectedIndex];
          if (event.target.value.length) { // it's /week or /month
            document.getElementById(dataset['domain'] || '')?.scrollIntoView(true);
            // this way saves the URL in the bar
            // window.location.href = `#${dataset['domain']}`
          }
        }
        }>
          {Object.entries(rolledUp).map(([domain, datasets]) =>
            <option key={domain} data-domain={domain} value={domain}>{domain} <AddsSubs addsSubs={getAddsSubs(datasets)} /></option>
          )}
        </select>
        : <>
          <h4>Jump to...</h4>
          {
            Object.entries(rolledUp).map(([domain, datasets]) =>
              <div key={domain} className={styles.jumpToItem}>
                <a href={`#${domain}`}>
                  {domain}
                </a>&nbsp;
                <AddsSubs addsSubs={getAddsSubs(datasets)} />
              </div>
            )
          }
          <p className={styles.jumpToFooter}>
            <Link href="/heatmap">Heatmap</Link>
          </p>
        </>
      }
    </div >
  )
}

export default DatasetJumpTo


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
    <>
      {adds > 0 && <Adds adds={adds} />}
      {((adds > 0) && (subs > 0)) && ", "}
      {subs > 0 && <Subs subs={subs} />}
    </>
  )
}

const Adds = ({ adds }: { adds: number }) =>
  adds > 0 ? <>{`+${adds} `}</> : null

const Subs = ({ subs }: { subs: number }) =>
  subs > 0 ? <>{`-${subs} `}</> : null
