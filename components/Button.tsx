import React, { forwardRef } from "react"
import styles from '../styles/Button.module.css'

const Button = forwardRef((props: React.ComponentProps<"button">, ref: any) => {
  return <button ref={ref} className={styles.bigButton} {...props} />
})
Button.displayName = "Button"
export default Button