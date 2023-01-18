import { useMemo, useState } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './Picker.module.css'
import Button from './Button'
import ButtonGroup from './ButtonGroup';
import { type TimestampDirection, Direction } from '../data/seafowl';

interface PickerProps {
  data: Array<TimestampDirection> | undefined;
}
const Picker = ({ data }: PickerProps) => {
  const router = useRouter()
  const [isLoading] = useState(false); // prevent double button clicks + signal activity
  const response = useMemo(() =>
    data ? Object.fromEntries(data.map(({ direction, timestamp }) => [direction, timestamp])) : {},
    [data]);

  const selectedTimeUnit = router.pathname === '/' ? 'week' : router.pathname.split('/')[1] === '[index]' ? 'day' : router.pathname.split('/')[1];

  const getPrev = () => {
    switch (selectedTimeUnit) {
      case 'week':
        return response?.prev_week && response.prev_week.slice(0, 10)
      case 'month':
        return response?.prev_month && response?.prev_month.slice(0, 10);
      case 'day':
        return response?.prev_month && response?.prev_day.slice(0, 10);
      default:
        return ''
    }
  }

  const getNext = () => {
    switch (selectedTimeUnit) {
      case 'week':
        return response?.next_week && response.next_week.slice(0, 10)
      case 'month':
        return response?.next_month && response.next_month.slice(0, 10)
      case 'day':
        return response?.next_day && response.next_day.slice(0, 10)
      default:
        return ''
    }
  }

  const getPrevLinkHref = () => {
    if (isLoading || prevDisabled) {
      // <Link> disallows href attr of undefined. Thus, use empty string
      return ''
    }
    return selectedTimeUnit === 'day' ? getPrev() : `/${selectedTimeUnit}/${getPrev()}`
  }

  const getNextLinkHref = () => {
    if (isLoading || nextDisabled) {
      return ''
    }
    return selectedTimeUnit === 'day' ? getNext() : `/${selectedTimeUnit}/${getNext()}`
  }

  const prevDisabled = isLoading || selectedTimeUnit === 'day'
    ? !(Direction.prev_day in response)
    : selectedTimeUnit === 'week'
      ? !(Direction.prev_week in response)
      : !(Direction.prev_month in response)

  const nextDisabled = response === undefined || selectedTimeUnit === 'day'
    ? !(Direction.next_day in response)
    : selectedTimeUnit === 'week'
      ? !(Direction.next_week in response)
      : !(Direction.next_month in response)

  return (
    <div className={styles.root}>
      {prevDisabled ? <Button disabled={true}>← Previous </Button> :
        <Link href={getPrevLinkHref()}>
          <Button>← Previous </Button>
        </Link>
      }
      <span className={styles.padding}>&nbsp;</span>
      <ButtonGroup
        selected={selectedTimeUnit}
        isLoading={isLoading}
        day={response[Direction.equivalent_day]}
        week={response[Direction.equivalent_week]}
        month={response[Direction.equivalent_month]}
      />
      <span className={styles.padding}>&nbsp;</span>
      {nextDisabled ? <Button disabled={true}>Next →</Button> :
        <Link href={getNextLinkHref()}>
          <Button>Next →</Button>
        </Link>
      }
    </div>
  )
}
export default Picker

