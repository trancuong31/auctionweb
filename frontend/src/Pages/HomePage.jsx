import React from "react";
import AuctionSection from "../components/layout/Auctions";
import NavBar from "../components/layout/NavBar";

function HomePage() {
  return (
    <>
      <NavBar />
      <AuctionSection title="Ongoing auctions" type="ongoing" />
      <AuctionSection title="Upcoming auctions" type="upcoming" />
      <AuctionSection title="Ended auctions" type="ended" />
    </>
  );
}

export default HomePage;
