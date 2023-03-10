import { useState } from 'react'
import SplitgraphRepoUrl from './SplitgraphRepoUrl';
import Button from './Button'
import styles from './Dataset.module.css'
import { type DatasetWithSplitgraphURL } from './DatasetList';

const Dataset = ({ id, name, domain, description, is_added, splitgraphURL }: DatasetWithSplitgraphURL) => {
  const [fullDesc, setFullDesc] = useState(false);
  const [showRepo, setShowRepo] = useState(false);

  return (
    <div className={styles.dataset}>
      <h4 style={{ width: '88%' }}>
        {is_added ?
          <a href={splitgraphURL}>
            {name}
          </a>
          : <>{name}</>
        }
      </h4>
      <div style={{
        position: 'absolute',
        top: '11px',
        right: '-14px',
        padding: '0.5rem',
        width: '4rem',
        background: is_added ? '#009635' : 'red',
        color: 'white',
        textAlign: 'center',
        boxShadow: `2px 2px 4px gray`,
        borderRadius: '4px',
        fontSize: '8pt'
      }}>{is_added ? "NEW" : "DELETED"}</div>
      {
        description && <>
          <p style={{
            display: '-webkit-box',
            fontSize: '12px',
            ...(!fullDesc && {
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2'
            })

          }}>
            {description}
          </p>
        </>
      }
      <div className={styles.buttonFooter}>
        {description && <Button onClick={() => setFullDesc(!fullDesc)}>{fullDesc ? 'less' : 'more'}</Button>}
        <div style={{ width: '100%' }}>&nbsp;</div>
        {/* If the repo is deleted, it doesn't make sense to link to a definitely missing page */}
        {is_added && <><a href={`https://${domain}/d/${id}`}><Button>upstream</Button></a> &nbsp;</>}
        {showRepo && <div className={styles.repoButton}>
          <SplitgraphRepoUrl id={id} name={name} domain={domain} />
        </div>}
      </div>
    </div >
  )
}


export default Dataset