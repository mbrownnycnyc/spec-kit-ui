import { useEffect } from 'react'

export const useTheme = (isDarkTheme) => {
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [isDarkTheme])
}