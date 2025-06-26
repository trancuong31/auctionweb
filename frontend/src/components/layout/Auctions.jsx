// src/components/layout/AuctionSection.jsx
import React, { useEffect, useState } from "react";
import imagedefault from "../../assets/images/imagedefault.png";
import "./Auctions.css";
import CountdownTimer from "../../components/common/CountDownTime";
// import Loading from "./Loading"
import { useNavigate } from "react-router-dom";
const AuctionSection = ({ title, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [totalOngoing, setTotalOngoing] = useState(0);
  const [totalUpcoming, setTotalUpcoming] = useState(0);
  const [totalEnded, setTotalEnded] = useState(0);
  const statusMap = {
    ongoing: 0,
    upcoming: 1,
    ended: 2,
  };
  const handleClick = (id) => {
    navigate(`/auctions/${id}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/v1/auctions?status=${statusMap[type]}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setItems(Array.isArray(data.auctions) ? data.auctions : []);
        setTotalOngoing(data.total_ongoing || 0);
        setTotalUpcoming(data.total_upcoming || 0);
        setTotalEnded(data.total_ended || 0);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);
  const getTotal = () => {
    if (type === "ongoing") return totalOngoing;
    if (type === "upcoming") return totalUpcoming;
    if (type === "ended") return totalEnded;
    return 0;
  };
  const renderCard = (item) => (
    <div className="auction-card"  key={item.id} onClick={() => handleClick(item.id)} style={{ cursor: "pointer" }}>
      <div className="auction-image">
        <img
          src={item.image_url || imagedefault}
          alt={item.title || "Auction"}
          className={!item.image_url ? "img-no" : ""}
        />
        {type === "ongoing" && (
          <div className="countdown-overlay">
            <CountdownTimer targetTime={item.end_time} />
          </div>
        )}
      </div>
      <div className="auction-info">
        <p><span className="label">Name:</span> {item.title}</p>
        <p><span className="label">Starting price:</span> {item.starting_price}$</p>
        <p><span className="label">Price step:</span> {item.step_price}$</p>
        <p><span className="label">Start time:</span> <b>{new Date(item.start_time).toLocaleString()}</b></p>
        <p><span className="label">End time:</span> <b>{new Date(item.end_time).toLocaleString()}</b></p>
        
      </div>
    </div>
  );

  if (loading) return <p className="loading">Đang tải {title.toLowerCase()}...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="section">
      
      <h2 className="section-title">{title}</h2>
      <p id="total">total: {getTotal()} assets</p>
      <div className="card-grid">
        {items.length > 0 ? items.map(renderCard) : <p id="note-auction">There are no auctions available</p>}
      </div>
      <a href="#" className="see-all">See all</a>
    </div>
  );
};

export default AuctionSection;
