import React from "react";
import AuctionSection from "../components/layout/Auctions";
// import Header
function HomePage() {
  return (
    <main className="homepage-content">
      <AuctionSection title="Ongoing auctions" type="ongoing" />
      <AuctionSection title="Upcoming auctions" type="upcoming" />
      <AuctionSection title="Ended auctions" type="ended" />
    </main>
  );
}

export default HomePage;
