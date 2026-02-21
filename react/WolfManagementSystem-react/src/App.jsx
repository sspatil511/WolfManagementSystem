import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Button variant="default" size="default">Click me</Button>
    </main>
  )
}

export default App
