import AuctionSection from "../components/layout/Auctions";
function HomePage() {
  return (
    <main className="shadow-[0_4px_24px_rgba(0,0,0,0.30)] p-4 rounded-xl">
      <AuctionSection title="Ongoing auctions" type="ongoing" />
      <AuctionSection title="Upcoming auctions" type="upcoming" />
      <AuctionSection title="Ended auctions" type="ended" />
    </main>
  );
}

export default HomePage;
