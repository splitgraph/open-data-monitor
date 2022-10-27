import { ResponsiveCalendar } from '@nivo/calendar'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.

interface HeatmapProps {
  data: Array<any>;
  onClick: (e: any) => void;
}
const Heatmap = (props: HeatmapProps) => {
  const { data, ...rest } = props
  https://www.splitgraph.com/splitgraph/socrata/20221027-000122/-/overview
  return (
    <ResponsiveCalendar
      data={data}
      from="2020-08-01"
      to="2022-12-31"
      emptyColor="#ddd"
      colors={['#0e4429', '#006d32', '#26a641', '#39d353']}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={60}
      monthBorderColor="#ffffff"
      dayBorderWidth={4}
      dayBorderColor="#ffffff"
      legends={[
        {
          anchor: 'top-right',
          direction: 'column',
          translateX: -36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          toggleSerie: true
          // itemDirection: 'right-to-left'
        }
      ]}
      {...rest}
    />
  )

}

export default Heatmap