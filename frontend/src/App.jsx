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
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auctions/:id" element={<AuctionDetail />} />
        <Route path="/auctions/create" element={<CreateAuctionForm />} />
        <Route path="/auctions/search" element={<AuctionSearch />} />
        <Route path="/admin" element={<OverViewAdmin />} />
      </Route>

      {/* Not use layout */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
