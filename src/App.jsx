import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SlidingThemeToggle, ThemeToggleButton } from './components/ThemeButton'
import { useTheme } from './context/ThemeProvider'
import AppLayout from './context/AppLayout'
 

function App() {
  const [count, setCount] = useState(0)
  const { theme } = useTheme()
  console.log(theme)

  return (
    <>
    <AppLayout>
        <ThemeToggleButton />
        <SlidingThemeToggle />
      </AppLayout>
    </>
  )
}

export default App
