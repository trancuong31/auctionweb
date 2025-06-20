import React, { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    fetch("/api/v1/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default App
