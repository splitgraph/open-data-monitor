import { useState } from 'react'
import SplitgraphRepoUrl from './SplitgraphRepoUrl';
import Button from './Button'
import styles from './Dataset.module.css'

interface DatasetProps {
  id: string;
  name: string;
  domain: string;
  description: string;
  isAdded: boolean;
}
const Dataset = ({ id, name, domain, description, isAdded }: DatasetProps) => {
  const [fullDesc, setFullDesc] = useState(false);
  const [showRepo, setShowRepo] = useState(false);

  return (
    <div className={styles.dataset}>
      <h4 style={{ width: '88%' }}>{name}</h4>
      <div style={{
        position: 'absolute',
        top: '11px',
        right: '-14px',
        padding: '0.5rem',
        width: '4rem',
        background: isAdded ? '#009635' : 'red',
        color: 'white',
        textAlign: 'center',
        boxShadow: `2px 2px 4px gray`,
        borderRadius: '4px',
        fontSize: '8pt'
      }}>{isAdded ? "NEW" : "DELETED"}</div>
      {description && <>
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
        {isAdded && <><Button onClick={() => { setShowRepo(!showRepo) }}>repo</Button> &nbsp;</>}
        {showRepo && <div className={styles.repoButton}>
          <SplitgraphRepoUrl id={id} name={name} domain={domain} />
        </div>}
      </div>
    </div >
  )
}


export default Dataset