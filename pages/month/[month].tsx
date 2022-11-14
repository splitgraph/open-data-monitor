import { useRouter } from 'next/router'
import RootLayout from '../../layouts/Root'
import MonthlyDiff from '../../components/MonthlyDiff'

const MonthPage = () => {
  const router = useRouter();
  const { month } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <RootLayout>
      <MonthlyDiff timestamp={month as string} />
    </RootLayout>
  )
}
export default MonthPage