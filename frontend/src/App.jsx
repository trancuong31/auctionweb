import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AdminPage from "./Pages/AdminPage";
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import AuctionDetail from "./components/layout/AuctionDetail";
import CreateAuctionForm from "./components/layout/AuctionCreate.jsx";
import AuctionSearch from "./components/layout/AuctionSearch.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import OverViewAdmin from "./components/layout/OverviewAdmin.jsx";
import Rule from "./components/layout/Rule.jsx";
import Tutorial from "./components/layout/Tutorial.jsx";
import Contact from "./components/layout/Contact.jsx";
import History from "./components/layout/History.jsx";
import Information from "./components/layout/Information.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/auctions/:id" element={<AuctionDetail />} />
          <Route path="/auctions/create" element={<CreateAuctionForm />} />
          <Route path="/auctions/search" element={<AuctionSearch />} />
          <Route path="/admin" element={<OverViewAdmin />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<Information />} />
          <Route path="/history" element={<History />} />
          <Route path="/policy" element={<Rule />} />
          <Route path="/guide" element={<Tutorial />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        {/* Not use layout */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
