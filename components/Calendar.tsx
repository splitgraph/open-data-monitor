// const today = new Date()
// const tomorrow = new Date(today)
// tomorrow.setDate(tomorrow.getDate() + 1)
// const in3Days = new Date(today)
// in3Days.setDate(in3Days.getDate() + 3)
// const in5Days = new Date(today)
// in3Days.setDate(in5Days.getDate() + 5)
// const datesToAddContentTo = [tomorrow, in3Days, in5Days];

// const tileContent = ({ date, view }: CalendarTileProperties) => {
//   // Add class to tiles in month view only
//   // console.log({ date, view })
//   if (view === 'month') {
//     // Check if a date React-Calendar wants to check is on the list of dates to add class to
//     // if (datesToAddContentTo.find(dDate => isSameDay(dDate, date))) {
//     // return 'My content';
//     // }
//   }
//   return <div>hi</div>
// }
// interface SocfeedCalendarProps {
//   date: CalendarProps['value']
//   setDate: CalendarProps['onChange'],
//   tags: string[]
// }
// const SocfeedCalendar = ({ date, setDate, tags }: SocfeedCalendarProps) => {
//   return (
//     <Calendar
//       onChange={setDate}
//       value={date}
//       tileDisabled={(e) => {
//         return false
//       }}
//       tileContent={tileContent}
//       onClickDay={(e) => {
//         console.log(e)
//       }}
//     />
//   )
// }

// export default SocfeedCalendar