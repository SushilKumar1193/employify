import { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { StatsContainer, Loading, ChartsContainer } from '../../components'

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext()
  useEffect(() => {
    showStats()
  }, [])

  if (isLoading) {
    return <Loading center />
  }

  return (
    <>
      <div className='coffee-info'>
        <span>find the app useful?</span>
        {/* <a href='https://www.buymeacoffee.com/johnsmilga'> */}
        <a href='https://www.myntra.com/'>

          you can always buy me a coffee
        </a>
      </div>
      <StatsContainer />
      {/* {monthlyApplications.length > 0 && <ChartsContainer />} */}
      {monthlyApplications==null?false: monthlyApplications.length > 0 && <ChartsContainer />}

    </>
  )
}

export default Stats