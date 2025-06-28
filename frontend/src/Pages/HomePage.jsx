import React from "react";
import AuctionSection from "../components/layout/Auctions";
import NavBar from "../components/layout/NavBar";

function HomePage() {
  return (
    <>
      <NavBar />

      <main className="homepage-content p-20">
        <AuctionSection title="Ongoing auctions" type="ongoing" />
        <AuctionSection title="Upcoming auctions" type="upcoming" />
        <AuctionSection title="Ended auctions" type="ended" />
      </main>
    </>
  );
}

export default HomePage;
