import { useRef, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/router'
import { subDays, subMonths, format } from 'date-fns';
import { type DateRange, DayPicker, useDayRender, type DayProps, type Matcher, Button } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import style from './DayPicker.module.css';
import { filterDates, type Tag } from '../data/index';

export const tagifyDate = (date: Date): string => {
  return date?.toISOString().slice(0, 10).split('-').join('')
}

export const dateifyTag = (i: string | Array<string>) => {
  // Handle duped query params case
  if (typeof i === 'object') {
    throw new Error("Should be only one query param for from/to")
  }
  // Handle 'too long' tag - should be e.g. `20210101` not `20210101-1234`
  if (!/^[0-9]{8}$/.test(i)) {
    throw new Error("Tag should be 8 chars long " + i);
  }

  const year = Number(String(i).slice(0, 4));
  const month = Number(String(i).slice(4, 6));
  const day = Number(String(i).slice(6, 8));
  const date = new Date(year, month - 1, day)
  return date
}

interface RangePickerProps {
  tags: any,
  range: any,
  setRange: Dispatch<SetStateAction<DateRange | undefined>>
}
const RangePicker = ({ tags, range, setRange }: RangePickerProps) => {
  // Weirdly, directly setting router.query.from/to causes lots of seemingly
  // spurious/unwanted re-renders. Will probably remove this in the near future
  // const setRangeQueryParam = (range: DateRange | undefined) => {
  //   console.log({ range })
  //   if (range) {
  //     const newQueryParameters = {
  //       ...router.query,
  //       ...(range.from && { from: tagifyDate(range.from) }),
  //       ...(range.to && { to: tagifyDate(range.to) })
  //     }
  //     router.replace({
  //       pathname: router.pathname,
  //       query: newQueryParameters,
  //     });
  //   }
  // }

  // const getRange = (): DateRange | undefined => {
  //   const { from, to } = router.query
  //   if (typeof from === 'object' || typeof to === 'object') {
  //     throw Error('must have only one instance of from/to param')
  //   }
  //   if (!from) {
  //     return undefined
  //   }
  //   const range = {
  //     from: dateifyTag(from) || undefined,
  //     ...(to && { from: dateifyTag(to) })
  //   }
  //   console.log('getRange()', range)
  //   return range
  // }

  /**
   * checkDate helps DayPicker know whether to disable a date
   * @param date takes a date, typically provided by DayPicker's disabled prop
   * @returns true if it was not included in the tags
   */
  const checkDate = (date: Date) => {
    return !filterDates(tags)?.includes(tagifyDate(date))
  }

  return (
    <DayPicker
      mode="range"
      numberOfMonths={2} // Two up month display
      defaultMonth={subMonths(new Date(), 1)} // Default current and prev month
      selected={range}
      onSelect={setRange}
      disabled={checkDate}
      modifiersClassNames={{ today: style.today }} // make today more prominent
    />
  );
}
export default RangePicker

interface DayComponentProps extends DayProps {
  tags: Array<string>;
}
const DayComponent = (props: DayComponentProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dayRender = useDayRender(props.date, props.displayMonth, buttonRef);

  if (dayRender.isHidden) {
    return <></>;
  }
  if (!dayRender.isButton) {
    return <div {...dayRender.divProps} />;
  }

  return <Button name="day" ref={buttonRef} {...dayRender.buttonProps} />;
}