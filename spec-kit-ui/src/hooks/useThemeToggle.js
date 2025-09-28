import { useState, useCallback } from 'react'

export const useThemeToggle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const toggleTheme = useCallback(() => {
    setIsDarkTheme(!isDarkTheme)
  }, [isDarkTheme])

  return { isDarkTheme, toggleTheme }
}