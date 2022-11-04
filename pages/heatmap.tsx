import { useState, useEffect } from 'react'
import useTags from '../useTags'
import Heatmap from '../components/Heatmap/Heatmap'

interface HeatmapValue {
  day: string;
  value: number;
}

const dateifyTag = (tag: string) => {
  const year = tag.slice(0, 4);
  const month = tag.slice(4, 6).padStart(2, '0');
  const day = tag.slice(6, 8).padStart(2, '0');
  return `${year}-${month}-${day}`
}

const tagifyDate = (date: string) => {
  return date.replaceAll('-', '');
}

const HeatmapPage = () => {
  const { tags, tagsError } = useTags();
  const [data, setData] = useState<Array<HeatmapValue>>([]);
  const [activeTab, setActiveTab] = useState(new Date('2024').getFullYear());

  const handleChange = (e: React.SyntheticEvent) => {
    setActiveTab(Number(e.currentTarget.getAttribute('label')) + 1)
  }

  useEffect(() => {
    const valuesAndDays = new Map<string, number>();
    tags?.forEach(tag => {
      if (tag.length === 8) {
        valuesAndDays.set(tag, 1)
      }
    })

    tags?.forEach(tag => {
      if (tag.length === 15) {
        const rootTag = tag.slice(0, 8);
        // @ts-ignore
        valuesAndDays.set(rootTag, valuesAndDays.get(rootTag) + 1)
      }
    })

    const result: Array<HeatmapValue> = []
    for (const [key, value] of valuesAndDays) {
      result.push({ day: dateifyTag(key), value })
    }
    setData(result);
  }, [tags])

  return (
    <div style={{
      height: '330px',
      width: '900px',
      border: '1px solid gray',
      borderRadius: '.5rem',
      margin: '1em auto',
      padding: '1em',
      paddingBottom: '5em',
      boxShadow: '0px 2px 6px #AAA'
    }}>
      {tagsError
        ?
        <div>Sorry, could&#39;t load tags.</div>
        :
        <>
          <div>
            {!!data.length && <h5>{data.length} tags found</h5>}
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '235px', marginLeft: 'auto' }}>
              <Tab label={2020} onClick={handleChange} active={activeTab === new Date('2022').getFullYear()} />&nbsp;
              <Tab label={2021} onClick={handleChange} active={activeTab === new Date('2023').getFullYear()} />
              <Tab label={2022} onClick={handleChange} active={activeTab === new Date('2024').getFullYear()} />
            </div>
          </div>
          <Heatmap data={data}
            onClick={(e: any) => {
              const { value } = e;
              if (!value) return;
              const tag = tagifyDate(e.day)
              const url = `https://www.splitgraph.com/splitgraph/socrata/${tag}/-/tables`
              window.location.assign(url);
            }}
            from={new Date(activeTab + '')}
            to={new Date(activeTab + '')}
          />

        </>
      }
    </div>
  )
}

export default HeatmapPage

const Tab = (props: any) => {
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => { setHover(true) };
  const handleMouseLeave = () => { setHover(false) };
  const { active, ...rest } = props;
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: props.active ? '#1f6feb' : hover ? 'gray' : undefined,
        color: props.active ? 'white' : undefined,
        padding: '1rem',
        borderRadius: '.5rem',
      }}
      {...rest}
    >{props.label}</div>
  )
}