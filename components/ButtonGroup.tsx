import Link from 'next/link'
import styles from './ButtonGroup.module.css'

/**
 * ButtonGroup
 * 
 * Select multiple options from a single element
 * Matches styling of <Button>
 */
interface ButtonGroupProps {
  selected: string;
  disabled?: boolean;
  day?: string;
  week?: string;
  month?: string;
  isLoading: boolean;
}
const ButtonGroup = (props: ButtonGroupProps) => {
  const { day, week, month, selected, ...rest } = props;
  console.log({ day, week, month })
  return (
    <div className={styles.buttonGroup}>
      <Button {...rest}
        disabled={!Boolean(day)}
        unit={'day'} data-time={day}
        className={`${styles.btn} ${styles.leftButton} ${selected === 'day' ? styles.active : ''}`}
      >
        Day
      </Button>
      <Button {...rest}
        disabled={!Boolean(week)}
        unit={'week'} data-time={week}
        className={`${styles.btn} ${styles.midButton} ${selected === 'week' ? styles.active : ''}`}
      >
        Week
      </Button>
      <Button {...rest}
        disabled={!Boolean(month?.length)}
        unit={'month'} data-time={month}
        className={`${styles.btn} ${styles.rightButton} ${selected === 'month' ? styles.active : ''}`}
      >
        Month
      </Button>
    </div >
  )
}

interface ButtonProps {
  children: React.ReactNode;
  unit: string;
  ["data-time"]?: string;
  isLoading: boolean;
  className?: string;
  disabled: boolean;
}
const Button = ({ unit, isLoading, disabled, ...rest }: ButtonProps) => {
  const getLinkHref = () => {
    const time = rest["data-time"]?.slice(0, 10)
    if (isLoading) {
      return ''
    }
    if (unit === 'day') {
      return `/${time}`
    }
    return `/${unit}/${time}`
  }

  return (
    disabled ? <button disabled={true} {...rest} /> :
      <Link href={getLinkHref()} >
        <button {...rest} />
      </Link>
  )
}

export default ButtonGroup