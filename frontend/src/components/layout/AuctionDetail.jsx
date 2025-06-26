// src/pages/AuctionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AuctionDetail.css"
import Header from './header';
import NavBar from './NavBar';
import Footer  from "./Footer";
import imagedefault from '../../assets/images/imagedefault.png';
const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/auctions/${id}`)
      .then(
        res =>{
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        }
      )
      .then(data => setAuction(data))
      .catch(err => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!auction) return <p>Không tìm thấy dữ liệu</p>;

  return (
    <>
      <Header />
      <NavBar />

      <div className="auction-detail-page">
        <h1>Title: {auction.title}</h1>
        <img
          src={auction.imageUrl && auction.imageUrl.trim() !== "" ? auction.imageUrl : imagedefault}
          alt={auction.title}
          className="auction-detail-image"
          style={{ maxWidth: "400px", marginBottom: "16px" }}
        />
        <p>Deadline: {new Date(auction.end_time).toLocaleDateString()}</p>
        <p>Starting price: {auction.starting_price.toLocaleString()}</p>
        <p>Step price: {auction.step_price}</p>
        <p>Status: {auction.status}</p>
        <p>Attached file: <a href={auction.file_exel} download>Download</a></p>
      </div>
      <div className="auction-button">
        <button>Auction</button>
      </div>
      <Footer />
    </>
  );
};

export default AuctionDetail;
