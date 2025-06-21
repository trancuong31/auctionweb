import React from "react";
import AuctionSection from "../components/auctions/AuctionSection";
import Header from './components/layout/header'
import NavBar from './components/layout/NavBar'

function HomePage() {
  return (
    <>
      <Header />
      <NavBar />

      <main className="homepage-content">
        <AuctionSection title="Ongoing auction" type="ongoing" />
        <AuctionSection title="Upcoming auction" type="upcoming" />
        <AuctionSection title="The auction has ended" type="ended" />
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
