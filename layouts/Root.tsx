import React from 'react'
import styles from './Root.module.css'
import HeadTag from '../components/HeadTag'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface RootLayoutProps {
  children: React.ReactNode
}
const RootLayout = ({ children }: RootLayoutProps) =>
  <div className={styles.container}>
    <HeadTag>
    </HeadTag>
    <Header />
    <main className={styles.main}>
      {children}
    </main>
    <Footer />
  </div >

export default RootLayout