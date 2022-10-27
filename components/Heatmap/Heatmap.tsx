import { ResponsiveCalendar, type DateOrString } from '@nivo/calendar'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.

interface HeatmapProps {
  data: Array<any>;
  onClick: (e: any) => void;
  from: DateOrString;
  to: DateOrString;
}
const Heatmap = (props: HeatmapProps) => {
  const { data, from, to, ...rest } = props

  return (
    <ResponsiveCalendar
      data={data}
      from={from}
      to={to}
      emptyColor="#ddd"
      colors={['#0e4429', '#006d32', '#26a641', '#39d353']}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={60}
      monthBorderColor="#ffffff"
      dayBorderWidth={4}
      dayBorderColor="#ffffff"
      legends={[
        {
          itemBackground: 'lightgray',
          anchor: 'bottom-right',
          direction: 'row',
          translateX: -56,
          translateY: -75,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 16,
          itemsSpacing: 10,
          // itemDirection: 'right-to-left'
        }
      ]}
      {...rest}
    />
  )

}

export default Heatmap