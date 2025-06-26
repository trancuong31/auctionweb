import React from "react";
import AuctionSection from "../components/layout/Auctions"; 
import Header from '../components/layout/header';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';

function HomePage() {
  return (
    <>
      <Header />
      <NavBar />
      <main className="homepage-content">        
        <AuctionSection title="Ongoing auctions" type="ongoing" />    
        <AuctionSection title="Upcoming auctions" type="upcoming" />    
        <AuctionSection title="Ended auctions" type="ended" />
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
