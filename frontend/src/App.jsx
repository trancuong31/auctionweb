import React, { useEffect, useState } from 'react'
import Header from './components/layout/header'
import NavBar from './components/layout/NavBar'
import Auctions from './components/layout/Auctions'
import Footer from './components/layout/Footer'
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
      <Auctions />
      {/* <h1>{message}</h1> */}
      <Footer />
    </div>
  )
}

export default App
