import { useRouter } from 'next/router'
import RootLayout from '../../layouts/Root'
import WeeklyDiff from '../../components/WeeklyDiff'


const WeekPage = () => {
  const router = useRouter();
  const { week } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>
  }


  return (
    <RootLayout>
      <WeeklyDiff timestamp={week as string} />
    </RootLayout>
  )
}
export default WeekPage