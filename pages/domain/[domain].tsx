import { useRouter } from 'next/router'
import RootLayout from '../../layouts/Root'
import WeeklyDiffByDomain from '../../components/WeeklyDiffByDomain'

const Domain = () => {
  const router = useRouter();
  const { domain } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <RootLayout>
      <WeeklyDiffByDomain domain={domain as string} />
    </RootLayout>
  )
}
export default Domain

