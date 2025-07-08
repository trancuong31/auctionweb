import AuctionSection from "../components/layout/Auctions";
function HomePage() {
  return (
    <main className="bg-gray-100 p-4 rounded-xl">
      <AuctionSection title="Ongoing auctions" type="ongoing" />
      <AuctionSection title="Upcoming auctions" type="upcoming" />
      <AuctionSection title="Ended auctions" type="ended" />
    </main>
  );
}

export default HomePage;
