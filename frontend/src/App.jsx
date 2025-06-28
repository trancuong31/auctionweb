import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AdminPage from "./Pages/AdminPage";
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import AuctionDetail from "./components/layout/AuctionDetail";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header.jsx";
import CreateAuctionForm from "./components/layout/AuctionCreate.jsx";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auctions/:id" element={<AuctionDetail />} />
        <Route path="/create" element={<CreateAuctionForm />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
