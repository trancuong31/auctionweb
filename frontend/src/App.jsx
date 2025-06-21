import React, { useEffect, useState } from 'react'
import Header from './components/layout/header'
import NavBar from './components/layout/NavBar'
function App() {
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    fetch("/api/v1/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <div>
      <Header />
      <NavBar />
      <h1>{message}</h1>
    </div>
  )
}

export default App
