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

const Mockup = () => {
  const { tags, tagsError } = useTags();
  const [data, setData] = useState<Array<HeatmapValue>>([]);

  useEffect(() => {
    const tagsArr = tags?.map(({ tag }) => tag)
    const valuesAndDays = new Map<string, number>();
    tagsArr?.forEach(tag => {
      if (tag.length === 8) {
        valuesAndDays.set(tag, 0)
      }
    })

    tagsArr?.forEach(tag => {
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
    <div style={{ height: '600px', background: 'gray' }}>
      {tagsError
        ?
        <div>Sorry, could not load tags.</div>
        :
        <Heatmap data={data}
          onClick={(e: any) => {
            const { value } = e;
            if (!value) return;
            const tag = tagifyDate(e.day)
            const url = `https://www.splitgraph.com/splitgraph/socrata/${tag}/-/tables`
            window.location.assign(url);
          }}
        />
      }
    </div>
  )
}

export default Mockup

