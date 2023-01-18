import type { ChangeEvent } from 'react';
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
  const [isLoading, setIsLoading] = useState(false); // improve UX of Picker when an <option> is chosen
  const response = useMemo(() =>
    data ? Object.fromEntries(data.map(({ direction, timestamp }) => [direction, timestamp])) : {},
    [data]);

  const dropdownIndex = router.pathname.split('/')[1] === '[index]' ? '' : router.pathname.split('/')[1];
  const selectedTimeUnit = router.pathname.split('/')[1] === '[index]' ? 'day' : router.pathname.split('/')[1];

  const getPrev = () => {
    switch (dropdownIndex) {
      case 'week':
        return response?.prev_week && response.prev_week.slice(0, 10)
      case 'month':
        return response?.prev_month && response?.prev_month.slice(0, 10);
      case '':// day - either '/' or '/2022-10-24%20blahblah'
        return response?.prev_month && response?.prev_day.slice(0, 10);
      default:
        return ''
    }
  }

  const getNext = () => {
    switch (dropdownIndex) {
      case 'week':
        return response?.next_week && response.next_week.slice(0, 10)
      case 'month':
        return response?.next_month && response.next_month.slice(0, 10)
      case '': // day - either '/' or '/2022-10-24%20blahblah'
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
    return dropdownIndex ? `/${dropdownIndex}/${getPrev()}` : getPrev()
  }

  const getNextLinkHref = () => {
    if (isLoading || nextDisabled) {
      return ''
    }
    return dropdownIndex ? `/${dropdownIndex}/${getNext()}` : getNext()
  }

  const goToday = () => {
    router.push('/')
  }

  const prevDisabled = isLoading || dropdownIndex === ''
    ? !(Direction.prev_day in response)
    : dropdownIndex === 'week'
      ? !(Direction.prev_week in response)
      : !(Direction.prev_month in response)

  const nextDisabled = response === undefined || dropdownIndex === ''
    ? !(Direction.next_day in response)
    : dropdownIndex === 'week'
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

