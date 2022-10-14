import { useState } from 'react';
import { subDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const defaultDate = new Date();
const RangePicker = () => {
  const defaultSelected: DateRange = {
    from: subDays(defaultDate, 1),
    to: defaultDate
  };
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

  let footer = <p>Please pick the first day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p>{format(range.from, 'PPP')}</p>;
    } else if (range.to) {
      footer = (
        <p>
          {format(range.from, 'PPP')}–{format(range.to, 'PPP')}
        </p>
      );
    }
  }

  return (
    <DayPicker
      mode="range"
      defaultMonth={defaultDate}
      selected={range}
      footer={footer}
      onSelect={setRange}
    />
  );
}
export default RangePicker