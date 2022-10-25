import { useState } from 'react'
import styles from '../styles/Home.module.css'
import SplitgraphRepoUrl from './SplitgraphRepoUrl';

interface DiffItem {
  permalink: string;
  desc: string;
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  domain: string;
}

// Render a diff
export const DiffItem = ({ permalink, desc, name, updated_at, created_at, domain, id }: DiffItem) => {
  const [fullDesc, setFullDesc] = useState(false);
  const [showRepo, setShowRepo] = useState(false);
  return (
    <div className={styles.card}>
      <h2>{name}</h2>
      <br />
      {desc &&
        <>
          <p style={{
            display: '-webkit-box',
            fontSize: '12px',
            ...(!fullDesc && {
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '4'
            })

          }}>
            {desc}
          </p>
          <button onClick={() => setFullDesc(!fullDesc)}>...</button>
        </>
      }
      <br />
      <p>{domain}</p>
      <br />
      Updated {updated_at}
      <br />
      Created {created_at}
      <br />
      <br />
      <a href={permalink} target="_new">🔗</a>
      <br />
      <div className={styles.repoButton}>
        <button onClick={() => { setShowRepo(!showRepo) }}>repo</button>&nbsp;
        {showRepo && <SplitgraphRepoUrl id={id} name={name} domain={domain} />}
      </div>
    </div >
  )
}


interface FeedEntriesProps {
  data: any;
  error: any;
  filter?: string;
}
export const DiffList = ({ data, error, filter }: FeedEntriesProps) => {
  // TODO: consider introducing a list view for 'big' results
  // const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  if (error) {
    return <h3>Sorry, something went wrong</h3>
  }

  return (
    <div className={styles.grid}>
      {
        data ?
          pluckDDNSuccess(data).length
            ? pluckDDNSuccess(data)
              .filter(() => true)
              .map((item: DiffItem) => {
                return <DiffItem key={item.id} {...item} />
              })
            : <h3>No records found. Try adjusting the dates</h3>
          : <p>loading...</p>
      }
    </div>
  )
}

export const pluckDDNSuccess = (data: any) => data?.success ? [...data.rows] : [];