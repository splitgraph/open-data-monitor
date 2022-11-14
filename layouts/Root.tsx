import React from 'react'
import styles from './Root.module.css'

interface RootLayoutProps {
  children: React.ReactNode
}
const RootLayout = ({ children }: RootLayoutProps) =>
  <div className={styles.parent}>
    <header className={`${styles.header} section coral`}>Header</header>
    <div className={`${styles.leftSide} section blue`}>Left Sidebar</div>
    <main className={`${styles.main} section green`}>
      {children}
    </main>
    <div className={`${styles.rightSide} section yellow`}>Right Sidebar</div>
    <footer className={`${styles.footer} section coral`}>Footer</footer>
  </div >

export default RootLayout