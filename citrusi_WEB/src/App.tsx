import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p className="text-red-600">test</p>
      <Button>Click me</Button>
    </>
  )
}

export default App
